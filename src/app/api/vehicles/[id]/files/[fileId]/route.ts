import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession, handleApiError, ApiError } from "@/lib/api-auth";
import { deleteObject } from "@/lib/s3";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const session = await requireSession();
    const file = await db.vehicleFile.findFirst({
      where: { id: params.fileId, vehicleId: params.id, dealershipId: session.user.dealershipId }
    });
    if (!file) throw new ApiError(404, "File not found");

    await db.vehicleFile.delete({ where: { id: file.id } });
    await deleteObject(file.url).catch(() => undefined);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
