"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface Contribution {
  id: string;
  reference: string;
  amount: number;
  status: string;
  createdAt: Date | string;
}

const ITEMS_PER_PAGE = 10;

export default function TransactionsTable({
  initialData,
}: {
  initialData: Contribution[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // 1. Filter dataset
  const filteredContributions = useMemo(() => {
    return initialData.filter((item) => {
      const matchesSearch = item.reference
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        item.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [initialData, searchTerm, statusFilter]);

  // 2. Paginate filtered dataset
  const totalPages =
    Math.ceil(filteredContributions.length / ITEMS_PER_PAGE) || 1;
  const paginatedContributions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContributions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredContributions, currentPage]);

  // 3. Export to CSV Handler
  const handleExportCSV = () => {
    const headers = ["ID,Reference,Amount (GHS),Status,Date"];
    const rows = filteredContributions.map((item) => [
      item.id,
      item.reference,
      (item.amount / 100).toFixed(2),
      item.status,
      `"${new Date(item.createdAt).toISOString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `transactions_export_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-6 p-6">
      {/* Navigation Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#5B6478] hover:text-[#111C3A] transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-[#111C3A]">
            Transaction History
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredContributions.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111C3A] px-4 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-[#111C3A]/90 disabled:opacity-50 transition-all"
        >
          <Download className="h-4 w-4" />
          Export CSV ({filteredContributions.length})
        </button>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-[#111C3A]/10 bg-white p-6 shadow-sm">
        {/* Filter Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#111C3A]/10">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
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

          <div className="text-xs text-[#5B6478]">
            Showing{" "}
            <span className="font-semibold text-[#111C3A]">
              {filteredContributions.length}
            </span>{" "}
            total results
          </div>
        </div>

        {/* Transactions Table */}
        {paginatedContributions.length === 0 ? (
          <div className="mt-8 flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#111C3A]/15 text-sm text-[#5B6478]/70">
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
                {paginatedContributions.map((item) => (
                  <tr
                    key={item.id}
                    className="text-[#111C3A] hover:bg-[#F7F5F1]/30 transition-colors"
                  >
                    <td className="py-4 font-mono text-xs font-medium">
                      {item.reference}
                    </td>
                    <td className="py-4 font-semibold">
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-[#111C3A]/10 pt-4 text-xs text-[#5B6478]">
            <p>
              Page{" "}
              <span className="font-semibold text-[#111C3A]">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#111C3A]">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-[#111C3A]/15 px-3 py-1.5 font-medium hover:bg-[#F7F5F1] disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-[#111C3A]/15 px-3 py-1.5 font-medium hover:bg-[#F7F5F1] disabled:opacity-40 transition-all"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
