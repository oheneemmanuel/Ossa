"use client";

import { Loader2, TrendingUp } from "lucide-react";

type Summary = {
  totalCollected: number;
  thisMonth: number;
  successCount: number;
  pendingCount: number;
  failedCount: number;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export default function FinanceSummaryCards({
  summary,
  loading,
}: {
  summary: Summary | null;
  loading: boolean;
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
          Total Collected
        </p>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        ) : (
          <p className="text-2xl font-bold text-black">
            {formatCurrency(summary?.totalCollected ?? 0)}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-1.5 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            This Month
          </p>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        ) : (
          <p className="text-2xl font-bold text-black">
            {formatCurrency(summary?.thisMonth ?? 0)}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
          Successful Payments
        </p>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        ) : (
          <p className="text-2xl font-bold text-black">{summary?.successCount ?? 0}</p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
          Pending / Failed
        </p>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        ) : (
          <p className="text-2xl font-bold text-black">
            {(summary?.pendingCount ?? 0) + (summary?.failedCount ?? 0)}
          </p>
        )}
      </div>
    </div>
  );
}