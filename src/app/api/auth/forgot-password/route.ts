// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";
import { sendResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });

  // Always return success even if user doesn't exist — avoids leaking
  // which emails are registered.
  if (!user) {
    return NextResponse.json({ success: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  // Invalidate any previous tokens for this user
  await db.passwordResetToken.deleteMany({ where: { userId: user.id } });

  await db.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  });

  await sendResetEmail(user.email, token);

  return NextResponse.json({ success: true });
}