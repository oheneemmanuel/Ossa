import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { name, description } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 });
  }

  // Deactivate whatever project is currently active
  await db.project.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  const project = await db.project.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      isActive: true,
    },
  });

  return NextResponse.json({ project });
}