// app/api/admin/finance/contributions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const status = req.nextUrl.searchParams.get("status") ?? "all";
  const search = req.nextUrl.searchParams.get("search")?.trim() ?? "";

  const contributions = await db.contribution.findMany({
    where: {
      ...(status !== "all" && { status }),
      ...(search && {
        user: {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    },
    select: {
      id: true,
      reference: true,
      amount: true,
      status: true,
      createdAt: true,
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ contributions });
}