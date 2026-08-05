// components/ui/dashboard/PaymentButtton.tsx
"use client";

import Script from "next/script";
import { useState } from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaystackButtonProps {
  email: string;
  amount: number;
  onSuccess?: (data: any) => void;
}

export default function PaystackButton({ email, amount, onSuccess }: PaystackButtonProps) {
  const [loading, setLoading] = useState(false);

  const payWithPaystack = () => {
    if (!window.PaystackPop) {
      alert("Payment script not loaded yet, try again in a second.");
      return;
    }
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: process.env.
      NEXT_PUBLIC_KEY,
      email,
      amount: amount * 100,
      currency: "GHS",
      ref: `ossa_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
      callback: function (response: { reference: string }) {
        verifyPayment(response.reference);
      },
      onClose: function () {
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  const verifyPayment = async (reference: string) => {
    try {
      const res = await fetch(`/api/paystack/verify?reference=${reference}`);
      const data = await res.json();

      if (data.status === true && data.data.status === "success") {
        onSuccess?.(data.data);
      } else {
        alert("Payment verification failed. If you were charged, contact support.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong verifying your payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <button
        onClick={payWithPaystack}
        disabled={loading || !amount}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#111C3A] px-4 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-[#B8935A] disabled:cursor-not-allowed disabled:bg-[#111C3A]/20 disabled:text-[#111C3A]/40"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          "Confirm & Pay"
        )}
      </button>
    </>
  );
}