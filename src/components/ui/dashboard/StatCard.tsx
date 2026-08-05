import { PiggyBank, ArrowUpRight } from "lucide-react";

interface ContributionCardProps {
  memberName?: string;
  amountContributed: number;
  targetAmount?: number;
  lastContributionDate?: string;
  currency?: string;
}

export function ContributionCard({
  memberName = "Member",
  amountContributed,
  targetAmount,
  lastContributionDate,
  currency = "$",
}: ContributionCardProps) {
  // Calculate percentage toward target if provided
  const percentage = targetAmount
    ? Math.min(Math.round((amountContributed / targetAmount) * 100), 100)
    : null;

  // Format numbers nicely with commas
  const formattedAmount = amountContributed.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedTarget = targetAmount?.toLocaleString("en-US", {
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

      {/* Optional Progress Bar (If targetAmount is provided) */}
      {targetAmount && percentage !== null && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progress ({percentage}%)</span>
            <span>
              Target: {currency}
              {formattedTarget}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Optional Footer: Last Contribution Date */}
      {lastContributionDate && (
        <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
          Last payment: {lastContributionDate}
        </div>
      )}
    </div>
  );
}
