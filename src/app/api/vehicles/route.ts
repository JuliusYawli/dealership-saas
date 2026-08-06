import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession, handleApiError } from "@/lib/api-auth";
import { vehicleSchema, vehicleListQuerySchema } from "@/lib/validations/vehicle";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const { searchParams } = new URL(req.url);
    const query = vehicleListQuerySchema.parse({
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined
    });

    const where: Prisma.VehicleWhereInput = {
      dealershipId: session.user.dealershipId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { make: { contains: query.search, mode: "insensitive" } },
              { model: { contains: query.search, mode: "insensitive" } },
              { stockNumber: { contains: query.search, mode: "insensitive" } },
              { vin: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const [vehicles, total] = await Promise.all([
      db.vehicle.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize
      }),
      db.vehicle.count({ where })
    ]);

    return NextResponse.json({ vehicles, total, page: query.page, pageSize: query.pageSize });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const parsed = vehicleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const vehicle = await db.vehicle.create({
      data: {
        ...parsed.data,
        dealershipId: session.user.dealershipId
      }
    });

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A vehicle with this VIN already exists" }, { status: 409 });
    }
    return handleApiError(err);
  }
}
