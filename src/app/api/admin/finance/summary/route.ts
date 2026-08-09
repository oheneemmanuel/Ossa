// app/api/admin/finance/summary/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth.config";
import { db } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalAgg, monthAgg, successCount, pendingCount, failedCount] = await Promise.all([
    db.contribution.aggregate({
      where: { status: "success" },
      _sum: { amount: true },
    }),
    db.contribution.aggregate({
      where: { status: "success", createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    db.contribution.count({ where: { status: "success" } }),
    db.contribution.count({ where: { status: "pending" } }),
    db.contribution.count({ where: { status: "failed" } }),
  ]);

  return NextResponse.json({
    totalCollected: totalAgg._sum.amount ?? 0,
    thisMonth: monthAgg._sum.amount ?? 0,
    successCount,
    pendingCount,
    failedCount,
  });
}