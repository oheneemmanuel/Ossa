"use client";

import { useState } from "react";
import PaystackButton from "@/components/ui/dashboard/PaymentButtton";
import { CheckCircle2, Landmark } from "lucide-react";

interface ContributionPaymentProps {
  email: string;
}

export default function ContributionPayment({
  email,
}: ContributionPaymentProps) {
  const [amount, setAmount] = useState<number>(0);
  const [paid, setPaid] = useState(false);

  if (paid) {
    return (
      <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#111C3A]/10 bg-[#111C3A] p-8 text-center shadow-sm">
        <CheckCircle2
          className="mx-auto mb-3 h-9 w-9 text-[#B8935A]"
          strokeWidth={1.5}
        />
        <p className="font-serif text-xl text-white">Contribution received</p>
        <p className="mt-1 text-sm text-white/60">
          A receipt has been sent to {email}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-2xl border border-[#111C3A]/10 bg-[#F7F5F1] shadow-sm">
      {/* Header strip */}
      <div className="flex items-center gap-2 border-b border-dashed border-[#111C3A]/15 px-6 py-4">
        <Landmark className="h-4 w-4 text-[#B8935A]" strokeWidth={1.75} />
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#5B6478]">
          Member Contribution
        </span>
      </div>

      <div className="px-6 pb-6 pt-5">
        <label className="block text-xs font-medium uppercase tracking-wide text-[#5B6478]">
          Amount
        </label>

        <div className="mt-2 flex items-baseline gap-2 border-b-2 border-[#111C3A]/20 pb-2 focus-within:border-[#111C3A] transition-colors">
          <span className="font-serif text-lg text-[#5B6478]">GHS</span>
          <input
            type="number"
            min={1}
            placeholder="0.00"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-transparent font-serif text-3xl tabular-nums text-[#111C3A] placeholder:text-[#111C3A]/25 focus:outline-none"
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-[#5B6478]">
          Paid on behalf of{" "}
          <span className="font-medium text-[#111C3A]">{email}</span>. Processed
          securely by Paystack.
        </p>

        <div className="mt-5">
          <PaystackButton
            email={email}
            amount={amount}
            onSuccess={() => setPaid(true)}
          />
        </div>
      </div>
    </div>
  );
}
