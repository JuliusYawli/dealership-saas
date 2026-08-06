import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession, handleApiError, ApiError } from "@/lib/api-auth";
import { presignRequestSchema } from "@/lib/validations/file";
import { buildFileKey, createUploadUrl } from "@/lib/s3";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const vehicle = await db.vehicle.findFirst({
      where: { id: params.id, dealershipId: session.user.dealershipId },
      select: { id: true }
    });
    if (!vehicle) throw new ApiError(404, "Vehicle not found");

    const body = await req.json();
    const parsed = presignRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const key = buildFileKey(session.user.dealershipId, vehicle.id, parsed.data.fileName);
    const uploadUrl = await createUploadUrl(key, parsed.data.fileType);

    return NextResponse.json({ uploadUrl, key });
  } catch (err) {
    return handleApiError(err);
  }
}
