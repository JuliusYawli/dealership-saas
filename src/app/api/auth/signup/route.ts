import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { dealershipName, fullName, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.$transaction(async (tx) => {
    const dealership = await tx.dealership.create({
      data: { name: dealershipName }
    });
    await tx.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName,
        role: "OWNER",
        dealershipId: dealership.id
      }
    });
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
