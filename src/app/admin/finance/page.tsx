// app/admin/finance/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { Wallet } from "lucide-react";
import FinanceSummaryCards from "@/components/ui/admin/FinanceSummaryCards";
import FinanceProjectBreakdown from "@/components/ui/admin/FinanceProjectBreakdown";
import FinanceContributionsTable from "@/components/ui/admin/FinanceContributionsTable";
import FinanceMemberSummary from "@/components/ui/admin/FinanceMembersSummary";

type Summary = {
  totalCollected: number;
  thisMonth: number;
  successCount: number;
  pendingCount: number;
  failedCount: number;
  byProject: {
    projectId: string;
    projectName: string;
    isActive: boolean;
    total: number;
    count: number;
  }[];
};

type Contribution = {
  id: string;
  reference: string;
  amount: number;
  status: string;
  createdAt: string;
  project: { id: string; name: string } | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

export default function FinancePage() {
  const [tab, setTab] = useState<"members" | "transactions">("members");
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
        showToast(
          err instanceof Error ? err.message : "Failed to load summary",
          "error",
        );
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, [showToast]);

  const fetchContributions = useCallback(
    async (query: string, statusFilter: string) => {
      setLoadingList(true);
      try {
        const params = new URLSearchParams({
          search: query,
          status: statusFilter,
        });
        const res = await fetch(`/api/admin/finance/contributions?${params}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Failed to load contributions");
        setContributions(data.contributions);
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Failed to load contributions",
          "error",
        );
      } finally {
        setLoadingList(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    const timeout = setTimeout(() => fetchContributions(search, status), 350);
    return () => clearTimeout(timeout);
  }, [search, status, fetchContributions]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 mt-9">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Wallet className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Finance
          </h1>
          <p className="text-sm text-slate-500">
            Contributions and payment activity
          </p>
        </div>
      </div>

      <FinanceSummaryCards summary={summary} loading={loadingSummary} />
      <FinanceProjectBreakdown
        byProject={summary?.byProject ?? []}
        loading={loadingSummary}
      />

      {/* Tabs */}
      <div className="mb-4 flex gap-1.5 border-b border-slate-200">
        <button
          onClick={() => setTab("members")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${
            tab === "members"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          By Member
        </button>
        <button
          onClick={() => setTab("transactions")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${
            tab === "transactions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          All Transactions
        </button>
      </div>

      {tab === "members" ? (
        <FinanceMemberSummary />
      ) : (
        <FinanceContributionsTable
          contributions={contributions}
          loading={loadingList}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
      )}
    </div>
  );
}