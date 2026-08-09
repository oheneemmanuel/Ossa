// app/forgot-password/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/providers/ToastProvider";
import { Mail, ArrowRight, Loader2, AlertCircle, MessageCircle, Shield } from "lucide-react";

// TODO: replace with your actual admin WhatsApp number / contact
const ADMIN_WHATSAPP = "https://wa.me/233544204635";
const ADMIN_CONTACT_LABEL = "+233 24 000 0000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("sent");
    } else {
      const data = await res.json();
      const message = data.error || "Something went wrong";
      setError(message);
      showToast(message, "error");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-3">
            <Shield className="h-3.5 w-3.5 text-blue-600" />
            <span>OSSA Membership</span>
          </div>

          {status !== "sent" && (
            <>
              <h1 className="text-2xl font-bold tracking-tight text-black">
                Forgot your password?
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Enter your email to submit a reset request, then contact an admin to complete it.
              </p>
            </>
          )}
        </div>

        {status === "sent" ? (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-black mb-1.5">
              Request submitted
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              We&apos;ve recorded your request for{" "}
              <span className="font-semibold text-black">{email}</span>.
              To finish resetting your password, please message an admin directly —
              email delivery isn&apos;t available yet.
            </p>

            <a
              href={ADMIN_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Message admin on WhatsApp
            </a>
            <p className="mt-3 text-xs text-slate-400">{ADMIN_CONTACT_LABEL}</p>

            <Link
              href="/login"
              className="mt-6 block text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="member@ossa.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-black placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit request</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <p className="text-xs text-slate-500">
                Remembered it?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-0.5"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}