// app/dashboard/finance/FinanceClient.tsx
"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Download } from "lucide-react";

export interface Contribution {
  id: string;
  reference: string;
  amount: number;
  status: string;
  createdAt: Date | string;
}

interface FinanceClientProps {
  contributions: Contribution[];
}

export default function FinanceClient({ contributions }: FinanceClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Filtered dataset calculation
  const filteredContributions = useMemo(() => {
    return contributions.filter((item) => {
      const matchesSearch = item.reference
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        item.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [contributions, searchTerm, statusFilter]);

  const renderBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "success" || s === "successful") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          Success
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
        {status}
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-[#111C3A]/10 bg-white p-6 shadow-sm">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#111C3A]/10">
        <h2 className="text-lg font-semibold text-[#111C3A]">
          Transaction History
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6478]" />
            <input
              type="text"
              placeholder="Search by reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#111C3A]/15 bg-[#F7F5F1]/50 pl-9 pr-4 py-2 text-xs text-[#111C3A] placeholder:text-[#5B6478]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111C3A]/10 transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative flex items-center">
            <Filter className="absolute left-3 h-3.5 w-3.5 text-[#5B6478]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#111C3A]/15 bg-[#F7F5F1]/50 pl-8 pr-4 py-2 text-xs font-medium text-[#111C3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#111C3A]/10 transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredContributions.length === 0 ? (
        <div className="mt-8 flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-[#111C3A]/15 text-sm text-[#5B6478]/70">
          <p>No transactions match your search criteria.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#111C3A]/10 text-xs text-[#5B6478]">
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111C3A]/5">
              {filteredContributions.map((item) => (
                <tr
                  key={item.id}
                  className="text-[#111C3A] hover:bg-[#F7F5F1]/30 transition-colors"
                >
                  <td className="py-4 font-mono text-xs font-medium">
                    {item.reference}
                  </td>
                  <td className="py-4 font-semibold text-[#111C3A]">
                    GHS {(item.amount / 100).toFixed(2)}
                  </td>
                  <td className="py-4">{renderBadge(item.status)}</td>
                  <td className="py-4 text-xs text-[#5B6478]">
                    {new Date(item.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
