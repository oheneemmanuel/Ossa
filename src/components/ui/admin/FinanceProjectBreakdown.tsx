"use client";

import { Loader2, FolderKanban, CheckCircle2 } from "lucide-react";

type ProjectTotal = {
  projectId: string;
  projectName: string;
  isActive: boolean;
  total: number;
  count: number;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export default function FinanceProjectBreakdown({
  byProject,
  loading,
}: {
  byProject: ProjectTotal[];
  loading: boolean;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FolderKanban className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-semibold text-black">Collections by Project</h2>
      </div>

      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
      ) : byProject.length === 0 ? (
        <p className="text-sm text-slate-400">No successful contributions yet.</p>
      ) : (
        <div className="space-y-2.5">
          {byProject.map((p) => (
            <div
              key={p.projectId}
              className="flex items-center justify-between rounded-xl bg-slate-50/60 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-black">{p.projectName}</p>
                {p.isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Active
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  {p.count} payment{p.count === 1 ? "" : "s"}
                </span>
              </div>
              <p className="text-sm font-semibold text-black">{formatCurrency(p.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}