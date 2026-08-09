// app/admin/finance/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import {
  Wallet,
  TrendingUp,
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

type Summary = {
  totalCollected: number;
  thisMonth: number;
  successCount: number;
  pendingCount: number;
  failedCount: number;
};

type Contribution = {
  id: string;
  reference: string;
  amount: number;
  status: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string } | null;
};

const statusOptions = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

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

export default function FinancePage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      try {
        const res = await fetch("/api/admin/finance/summary");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load summary");
        setSummary(data);
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to load summary", "error");
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, [showToast]);

  const fetchContributions = useCallback(async (query: string, statusFilter: string) => {
    setLoadingList(true);
    try {
      const params = new URLSearchParams({ search: query, status: statusFilter });
      const res = await fetch(`/api/admin/finance/contributions?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load contributions");
      setContributions(data.contributions);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load contributions", "error");
    } finally {
      setLoadingList(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchContributions(search, status), 350);
    return () => clearTimeout(timeout);
  }, [search, status, fetchContributions]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Wallet className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Finance</h1>
          <p className="text-sm text-slate-500">Contributions and payment activity</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
            Total Collected
          </p>
          {loadingSummary ? (
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
          {loadingSummary ? (
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
          {loadingSummary ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
          ) : (
            <p className="text-2xl font-bold text-black">{summary?.successCount ?? 0}</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
            Pending / Failed
          </p>
          {loadingSummary ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
          ) : (
            <p className="text-2xl font-bold text-black">
              {(summary?.pendingCount ?? 0) + (summary?.failedCount ?? 0)}
            </p>
          )}
        </div>
      </div>

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
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-black placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          />
        </div>

        <div className="flex gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
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
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : contributions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No contributions found.
                </td>
              </tr>
            ) : (
              contributions.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-black">
                    {c.user ? `${c.user.firstName} ${c.user.lastName}` : "Unknown member"}
                    {c.user && (
                      <p className="text-xs font-normal text-slate-400">{c.user.email}</p>
                    )}
                  </td>
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
      </div>
    </div>
  );
}