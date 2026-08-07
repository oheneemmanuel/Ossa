import React from "react";

export interface Contribution {
  id: string;
  reference: string;
  amount: number; // in pesewas
  status: string;
  createdAt: Date | string;
}

interface RecentTransactionsProps {
  contributions: Contribution[];
  limit?: number;
}

export default function RecentTransactions({
  contributions,
  limit = 5,
}: RecentTransactionsProps) {
  const recentList = contributions.slice(0, limit);

  const renderStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized === "success" || normalized === "successful") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          Success
        </span>
      );
    }

    if (normalized === "pending") {
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
      <div className="flex items-center justify-between pb-4 border-b border-[#111C3A]/10">
        <div>
          <h2 className="text-base font-semibold text-[#111C3A]">
            Recent Transactions
          </h2>
          <p className="text-xs text-[#5B6478] mt-0.5">
            Your latest contributions and payment verification statuses.
          </p>
        </div>
        <span className="text-xs font-medium text-[#5B6478]">
          Showing {recentList.length} of {contributions.length}
        </span>
      </div>

      {recentList.length === 0 ? (
        <div className="mt-4 flex h-36 items-center justify-center rounded-xl border border-dashed border-[#111C3A]/15 text-sm text-[#5B6478]/70">
          No transactions recorded yet
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#111C3A]/10 text-xs text-[#5B6478]">
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111C3A]/5">
              {recentList.map((item) => (
                <tr key={item.id} className="text-[#111C3A]">
                  <td className="py-3.5 font-mono text-xs font-medium text-[#111C3A]/90">
                    {item.reference}
                  </td>
                  <td className="py-3.5 font-semibold text-[#111C3A]">
                    GHS {(item.amount / 100).toFixed(2)}
                  </td>
                  <td className="py-3.5">{renderStatusBadge(item.status)}</td>
                  <td className="py-3.5 text-xs text-[#5B6478]">
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
