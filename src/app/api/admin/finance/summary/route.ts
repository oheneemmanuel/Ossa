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

  const [totalAgg, monthAgg, successCount, pendingCount, failedCount, projectAgg] =
    await Promise.all([
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
      db.contribution.groupBy({
        by: ["projectId"],
        where: { status: "success" },
        _sum: { amount: true },
        _count: { _all: true },
      }),
    ]);

  // Attach project names to the grouped totals
  const projectIds = projectAgg.map((p) => p.projectId);
  const projects = await db.project.findMany({
    where: { id: { in: projectIds } },
    select: { id: true, name: true, isActive: true },
  });
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const byProject = projectAgg
    .map((p) => ({
      projectId: p.projectId,
      projectName: projectMap.get(p.projectId)?.name ?? "Unknown project",
      isActive: projectMap.get(p.projectId)?.isActive ?? false,
      total: p._sum.amount ?? 0,
      count: p._count._all,
    }))
    .sort((a, b) => b.total - a.total);

  return NextResponse.json({
    totalCollected: totalAgg._sum.amount ?? 0,
    thisMonth: monthAgg._sum.amount ?? 0,
    successCount,
    pendingCount,
    failedCount,
    byProject,
  });
}