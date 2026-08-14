"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

type Contribution = {
  id: string;
  reference: string;
  amount: number;
  status: string;
  createdAt: string;
  project: { id: string; name: string } | null;
  user: { id: string; firstName: string; lastName: string; email: string } | null;
};

const statusOptions = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const ITEMS_PER_PAGE = 10;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function statusBadge(status: string) {
  const map: Record<string, { className: string; icon: React.ReactNode; label: string }> = {
    success: {
      className: "bg-emerald-50 text-emerald-700",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Success",
    },
    pending: {
      className: "bg-amber-50 text-amber-700",
      icon: <Clock className="h-3 w-3" />,
      label: "Pending",
    },
    failed: {
      className: "bg-rose-50 text-rose-700",
      icon: <XCircle className="h-3 w-3" />,
      label: "Failed",
    },
  };
  const style = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.className}`}>
      {style.icon}
      {style.label}
    </span>
  );
}

export default function FinanceContributionsTable({
  contributions,
  loading,
  search,
  onSearchChange,
  status,
  onStatusChange,
}: {
  contributions: Contribution[];
  loading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
}) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const totalPages = Math.ceil(contributions.length / ITEMS_PER_PAGE) || 1;
  const paginated = contributions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by member name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-black placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          />
        </div>

        <div className="flex gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                status === opt.value
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No contributions found.
                </td>
              </tr>
            ) : (
              paginated.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-black">
                    {c.user ? `${c.user.firstName} ${c.user.lastName}` : "Unknown member"}
                    {c.user && (
                      <p className="text-xs font-normal text-slate-400">{c.user.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.project?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.reference}</td>
                  <td className="px-4 py-3 font-medium text-black">{formatCurrency(c.amount)}</td>
                  <td className="px-4 py-3">{statusBadge(c.status)}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            <p>
              Page <span className="font-semibold text-black">{page}</span> of{" "}
              <span className="font-semibold text-black">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}