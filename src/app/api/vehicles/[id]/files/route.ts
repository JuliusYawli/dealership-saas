import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession, handleApiError, ApiError } from "@/lib/api-auth";
import { createFileRecordSchema } from "@/lib/validations/file";
import { createDownloadUrl } from "@/lib/s3";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const vehicle = await db.vehicle.findFirst({
      where: { id: params.id, dealershipId: session.user.dealershipId },
      select: { id: true }
    });
    if (!vehicle) throw new ApiError(404, "Vehicle not found");

    const files = await db.vehicleFile.findMany({
      where: { vehicleId: vehicle.id },
      orderBy: { createdAt: "desc" }
    });

    const withUrls = await Promise.all(
      files.map(async (file) => ({ ...file, downloadUrl: await createDownloadUrl(file.url) }))
    );

    return NextResponse.json({ files: withUrls });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const vehicle = await db.vehicle.findFirst({
      where: { id: params.id, dealershipId: session.user.dealershipId },
      select: { id: true }
    });
    if (!vehicle) throw new ApiError(404, "Vehicle not found");

    const body = await req.json();
    const parsed = createFileRecordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const file = await db.vehicleFile.create({
      data: {
        dealershipId: session.user.dealershipId,
        vehicleId: vehicle.id,
        fileName: parsed.data.fileName,
        fileType: parsed.data.fileType,
        fileSize: parsed.data.fileSize,
        url: parsed.data.key,
        uploadedById: session.user.id
      }
    });

    const downloadUrl = await createDownloadUrl(file.url);
    return NextResponse.json({ file: { ...file, downloadUrl } }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
