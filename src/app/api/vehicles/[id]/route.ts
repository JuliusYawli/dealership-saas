import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireSession, handleApiError, ApiError } from "@/lib/api-auth";
import { vehicleSchema } from "@/lib/validations/vehicle";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const vehicle = await db.vehicle.findFirst({
      where: { id: params.id, dealershipId: session.user.dealershipId },
      include: { files: { orderBy: { createdAt: "desc" } } }
    });
    if (!vehicle) throw new ApiError(404, "Vehicle not found");

    return NextResponse.json({ vehicle });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const parsed = vehicleSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await db.vehicle.updateMany({
      where: { id: params.id, dealershipId: session.user.dealershipId },
      data: parsed.data
    });
    if (result.count === 0) throw new ApiError(404, "Vehicle not found");

    const vehicle = await db.vehicle.findUnique({ where: { id: params.id } });
    return NextResponse.json({ vehicle });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "A vehicle with this VIN already exists" }, { status: 409 });
    }
    return handleApiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const result = await db.vehicle.deleteMany({
      where: { id: params.id, dealershipId: session.user.dealershipId }
    });
    if (result.count === 0) throw new ApiError(404, "Vehicle not found");

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
