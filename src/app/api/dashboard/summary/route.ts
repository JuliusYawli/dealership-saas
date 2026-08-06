import { NextResponse } from "next/server";
import { requireSession, handleApiError } from "@/lib/api-auth";
import { getDashboardSummary } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireSession();
    const summary = await getDashboardSummary(session.user.dealershipId);
    return NextResponse.json(summary);
  } catch (err) {
    return handleApiError(err);
  }
}
