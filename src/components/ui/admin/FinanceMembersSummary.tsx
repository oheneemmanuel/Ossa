"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

type MemberSummary = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  totalAmount: number;
  paymentCount: number;
  lastPaymentAt: string | null;
};

const ITEMS_PER_PAGE = 10;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export default function FinanceMemberSummary() {
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchMembers = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/finance/members?search=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      setMembers(data.members ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    const timeout = setTimeout(() => fetchMembers(search), 350);
    return () => clearTimeout(timeout);
  }, [search, fetchMembers]);

  const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE) || 1;
  const paginated = members.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div>
      <div className="relative mb-5 max-w-md">
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

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Total Contributed</th>
              <th className="px-4 py-3">Payments</th>
              <th className="px-4 py-3">Last Payment</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No contributing members found.
                </td>
              </tr>
            ) : (
              paginated.map((m) => (
                <tr
                  key={m.userId}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-black">
                    {m.firstName} {m.lastName}
                    <p className="text-xs font-normal text-slate-400">
                      {m.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-black">
                    {formatCurrency(m.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.paymentCount}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {m.lastPaymentAt
                      ? new Date(m.lastPaymentAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
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
  );
}
