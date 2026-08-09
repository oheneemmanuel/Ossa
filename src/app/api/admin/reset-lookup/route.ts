// app/api/admin/reset-lookup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "No user found with that email" }, { status: 404 });
  }

  const resetToken = await db.passwordResetToken.findFirst({
    where: { userId: user.id, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!resetToken) {
    return NextResponse.json(
      { error: "No active reset request. Ask them to submit 'Forgot password' first." },
      { status: 404 }
    );
  }

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken.token}`;

  return NextResponse.json({ link, expiresAt: resetToken.expiresAt });
}