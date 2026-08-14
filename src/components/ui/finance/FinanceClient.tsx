"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  // Take only the 5 most recent transactions for the summary view
  const recentContributions = useMemo(() => {
    return contributions.slice(0, 5);
  }, [contributions]);

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
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#111C3A]/10">
        <h2 className="text-lg font-semibold text-[#111C3A]">
          Recent Transactions
        </h2>
        <Link
          href="/dashboard/finance/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111C3A]/80 hover:text-[#111C3A] hover:underline transition-all"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Transactions Table */}
      {recentContributions.length === 0 ? (
        <div className="mt-6 flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-[#111C3A]/15 text-sm text-[#5B6478]/70">
          <p>No recent transactions found.</p>
        </div>
      ) : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#111C3A]/10 text-xs text-[#5B6478]">
                <th className="py-3 font-medium">Reference</th>
                <th className="py-3 font-medium">Amount</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111C3A]/5">
              {recentContributions.map((item) => (
                <tr key={item.id} className="text-[#111C3A] hover:bg-[#F7F5F1]/30 transition-colors">
                  <td className="py-3 font-mono text-xs font-medium">{item.reference}</td>
                  <td className="py-3 font-semibold">GHS {(item.amount / 100).toFixed(2)}</td>
                  <td className="py-3">{renderBadge(item.status)}</td>
                  <td className="py-3 text-xs text-[#5B6478]">
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
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