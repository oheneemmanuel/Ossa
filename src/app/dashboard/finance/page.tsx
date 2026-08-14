// app/dashboard/finance/page.tsx
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import FinanceClient from "@/components/ui/finance/FinanceClient";

export default async function FinancePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch all transactions for the current user, including which project each belongs to
  const contributions = await db.contribution.findMany({
    where: { user: { email: session.user.email } },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  // Calculate financial summary metrics
  const totalPesewas = contributions.reduce(
    (sum, c) => (c.status.toLowerCase() === "success" ? sum + c.amount : sum),
    0
  );
  const totalContributed = totalPesewas / 100;

  const successfulCount = contributions.filter(
    (c) => c.status.toLowerCase() === "success"
  ).length;

  const averagePesewas =
    successfulCount > 0 ? totalPesewas / successfulCount : 0;
  const averageContribution = averagePesewas / 100;

  // Group successful contributions by project
  const byProject = contributions.reduce((acc, c) => {
    if (c.status.toLowerCase() !== "success") return acc;
    const key = c.projectId;
    if (!acc[key]) {
      acc[key] = { projectName: c.project.name, totalPesewas: 0, count: 0 };
    }
    acc[key].totalPesewas += c.amount;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { projectName: string; totalPesewas: number; count: number }>);

  const projectBreakdown = Object.values(byProject).sort(
    (a, b) => b.totalPesewas - a.totalPesewas
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-semibold text-[#111C3A] mt-8">
          Financial Overview
        </h1>
     
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#111C3A]/10 bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6478]">
            Total Contributed
          </span>
          <p className="mt-2 text-3xl font-bold text-[#111C3A]">
            GHS {totalContributed.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-[#5B6478]">Lifetime successful payments</p>
        </div>

        <div className="rounded-2xl border border-[#111C3A]/10 bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6478]">
            Total Payments
          </span>
          <p className="mt-2 text-3xl font-bold text-[#111C3A]">
            {successfulCount}
          </p>
          <p className="mt-1 text-xs text-[#5B6478]">Completed transactions</p>
        </div>

        <div className="rounded-2xl border border-[#111C3A]/10 bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5B6478]">
            Average Contribution
          </span>
          <p className="mt-2 text-3xl font-bold text-[#111C3A]">
            GHS {averageContribution.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-[#5B6478]">Per completed payment</p>
        </div>
      </div>

      {/* Per-Project Breakdown */}
      {projectBreakdown.length > 0 && (
        <div className="rounded-2xl border border-[#111C3A]/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[#111C3A] mb-4">
            Contributions by Project
          </h2>
          <div className="space-y-3">
            {projectBreakdown.map((p) => (
              <div
                key={p.projectName}
                className="flex items-center justify-between rounded-xl bg-[#F7F5F1]/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#111C3A]">{p.projectName}</p>
                  <p className="text-xs text-[#5B6478]">
                    {p.count} payment{p.count === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#111C3A]">
                  GHS {(p.totalPesewas / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client Component with Search & Filterable Table */}
      <FinanceClient contributions={contributions} />
    </div>
  );
}