import { PiggyBank, ArrowUpRight } from "lucide-react";

interface ContributionCardProps {
  memberName?: string;
  amountContributed: number;
  lastContributionDate?: string;
  currency?: string;
}

export function ContributionCard({
  memberName = "Member",
  amountContributed,
  lastContributionDate,
  currency = "GHS ",
}: ContributionCardProps) {
  const formattedAmount = amountContributed.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* Top Header: Member Name & Icon */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Total Contribution
          </p>
          <h4 className="text-sm font-medium text-gray-900">{memberName}</h4>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <PiggyBank className="h-5 w-5" />
        </div>
      </div>

      {/* Main Metric */}
      <div className="mt-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-gray-900">
            {currency}
            {formattedAmount}
          </span>
        </div>
        <p className="text-xs text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
          <ArrowUpRight className="h-3.5 w-3.5" />
          Contributed so far
        </p>
      </div>

      {/* Footer: Last Contribution Date */}
      {lastContributionDate && (
        <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
          Last payment: {lastContributionDate}
        </div>
      )}
    </div>
  );
}
