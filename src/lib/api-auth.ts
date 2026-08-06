import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { Session } from "next-auth";
import { getAuthSession } from "@/lib/auth";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/**
 * Every dealership-scoped API route must call this first. It guarantees
 * session.user.dealershipId is present so queries can be scoped safely.
 */
export async function requireSession(): Promise<Session> {
  const session = await getAuthSession();
  if (!session?.user?.dealershipId) {
    throw new ApiError(401, "Unauthorized");
  }
  return session;
}

export function requireRole(session: Session, allowed: Role[]) {
  if (!allowed.includes(session.user.role)) {
    throw new ApiError(403, "Forbidden");
  }
}

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
