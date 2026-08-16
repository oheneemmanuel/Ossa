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
  minAmount?: number;
  onSuccess?: (data: any) => void;
}

export default function PaystackButton({
  email,
  amount,
  minAmount = 1,
  onSuccess,
}: PaystackButtonProps) {
  const [loading, setLoading] = useState(false);

  const payWithPaystack = () => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    // 1. Guard check for missing environment variable
    if (!publicKey) {
      alert("Paystack Public Key is missing. Check your .env.local file.");
      return;
    }

    // 2. Guard check for script availability
    if (!window.PaystackPop) {
      alert("Payment gateway is loading. Please try again in a moment.");
      return;
    }

    // 3. Guard check for email and amount
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!amount || amount < minAmount) {
      alert(`Please enter an amount of at least GHS ${minAmount}.`);
      return;
    }

    setLoading(true);

    try {
      // Initialize modern v2 PaystackPop instance
      const paystack = new window.PaystackPop();

      paystack.newTransaction({
        key: publicKey,
        email: email.trim(),
        amount: Math.round(amount * 100), // Ensures strictly integer pesewas/subunits
        currency: "GHS",
        reference: `ossa_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        onSuccess: (transaction: { reference: string }) => {
          verifyPayment(transaction.reference);
        },
        onCancel: () => {
          setLoading(false);
        },
        onError: (error: any) => {
          console.error("Paystack popup error:", error);
          alert("Could not initialize transaction. Check developer console.");
          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const res = await fetch(`/api/paystack/verify?reference=${reference}`);
      const data = await res.json();

      if (data.status === true && data.data?.status === "success") {
        onSuccess?.(data.data);
      } else {
        alert(
          "Payment verification failed. If charged, please contact support.",
        );
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
      <Script
        src="https://js.paystack.co/v2/inline.js"
        strategy="afterInteractive"
      />
      <button
        type="button"
        onClick={payWithPaystack}
        disabled={loading || !amount || amount < minAmount}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-[#B8935A] disabled:cursor-not-allowed disabled:bg-[#111C3A]/20 disabled:text-[#111C3A]/40"
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
