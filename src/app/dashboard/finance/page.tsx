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

  // Fetch all transactions for the current user
  const contributions = await db.contribution.findMany({
    where: { user: { email: session.user.email } },
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

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-semibold text-[#111C3A] mt-8">
          Financial Overview
        </h1>
        <p className="mt-1 text-sm text-[#5B6478]">
          Track your contribution history, payments, and transaction records.
        </p>
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

      {/* Client Component with Search & Filterable Table */}
      <FinanceClient contributions={contributions} />
    </div>
  );
}