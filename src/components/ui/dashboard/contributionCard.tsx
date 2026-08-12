// components/ui/dashboard/contributionCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PaystackButton from "@/components/ui/dashboard/PaymentButtton";
import { CheckCircle2, Landmark, ShieldCheck, Sparkles } from "lucide-react";

interface ContributionPaymentProps {
  email: string;
}

const PRESET_AMOUNTS = [20, 30, 50, 100]; // updated so all presets clear the 12 minimum
const MIN_AMOUNT = 12;

export default function ContributionPayment({
  email,
}: ContributionPaymentProps) {
  const [amount, setAmount] = useState<number>(0);
  const [justPaid, setJustPaid] = useState(false);
  const router = useRouter();

  const isBelowMinimum = amount > 0 && amount < MIN_AMOUNT;

  const handleSuccess = () => {
    setJustPaid(true);
    router.refresh();

    setTimeout(() => {
      setJustPaid(false);
      setAmount(0);
    }, 3500);
  };

  if (justPaid) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#111C3A] p-8 text-center shadow-md transition-all">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-semibold text-white">Payment Received!</h3>
        <p className="mt-1.5 text-sm text-[#5B6478]/80 text-gray-300">
          A receipt has been dispatched to{" "}
          <span className="font-medium text-white">{email}</span>.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-400">
          <Sparkles className="h-3.5 w-3.5 text-[#B8935A]" /> Updating
          dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-[#111C3A]/10 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#111C3A]/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#111C3A]/5 text-[#B8935A]">
            <Landmark className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#111C3A]">
              Make a Contribution
            </h3>
            <p className="text-xs text-[#5B6478]">Direct member payment</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <ShieldCheck className="h-3 w-3" /> Secure
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {/* Preset Amount Pills */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-red-600 mb-2">
            Quick Select
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`rounded-lg border py-1.5 text-xs font-medium transition-all ${
                  amount === preset
                    ? "border-[#111C3A] bg-[#111C3A] text-white shadow-xs"
                    : "border-[#111C3A]/15 bg-[#F7F5F1]/50 text-[#111C3A] hover:bg-[#F7F5F1]"
                }`}
              >
                GHS {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Field */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-black">
            Or Enter Custom Amount
          </label>
          <div
            className={`mt-1.5 flex items-center rounded-xl border bg-[#F7F5F1]/40 px-3.5 py-2.5 focus-within:bg-white focus-within:ring-2 transition-all ${
              isBelowMinimum
                ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/10"
                : "border-[#111C3A]/15 focus-within:border-[#111C3A] focus-within:ring-[#111C3A]/10"
            }`}
          >
            <span className="text-sm font-semibold text-[#5B6478] pr-2 border-r border-[#111C3A]/10">
              GHS
            </span>
            <input
              type="number"
              min={MIN_AMOUNT}
              placeholder="0.00"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent pl-3 font-semibold text-lg text-[#111C3A] placeholder:text-[#111C3A]/30 focus:outline-none tabular-nums"
            />
          </div>
          {isBelowMinimum && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              Minimum contribution is GHS {MIN_AMOUNT}.
            </p>
          )}
        </div>

        {/* Security / Account notice */}
        <p className="text-xs leading-relaxed text-[#5B6478] bg-[#F7F5F1]/60 rounded-lg p-2.5 border border-[#111C3A]/5">
          Contributing as{" "}
          <span className="font-semibold text-[#111C3A]">{email}</span>.
          Encrypted & processed via Paystack.
        </p>

        {/* Paystack CTA Button Wrapper */}
        <div className="pt-1">
          <PaystackButton
            email={email}
            amount={amount}
            minAmount={MIN_AMOUNT}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}