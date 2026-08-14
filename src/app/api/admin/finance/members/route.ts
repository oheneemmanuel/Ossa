import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const search = req.nextUrl.searchParams.get("search")?.trim() ?? "";

  const grouped = await db.contribution.groupBy({
    by: ["userId"],
    where: { status: "success" },
    _sum: { amount: true },
    _count: { _all: true },
    _max: { createdAt: true },
  });

  const userIds = grouped.map((g) => g.userId);

  const users = await db.user.findMany({
    where: {
      id: { in: userIds },
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const members = grouped
    .filter((g) => userMap.has(g.userId))
    .map((g) => {
      const user = userMap.get(g.userId)!;
      return {
        userId: g.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        totalAmount: g._sum.amount ?? 0,
        paymentCount: g._count._all,
        lastPaymentAt: g._max.createdAt,
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return NextResponse.json({ members });
}