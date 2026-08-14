import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { db } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await db.project.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  const project = await db.project.update({
    where: { id },
    data: { isActive: true },
  });

  return NextResponse.json({ project });
}