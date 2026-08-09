// app/admin/reset-requests/page.tsx
"use client";
import { useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { Search, Loader2, Copy, Check } from "lucide-react";

export default function ResetRequestsPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ link: string; expiresAt: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch(`/api/admin/reset-lookup?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      showToast(data.error || "No active reset request found", "error");
      return;
    }

    setResult(data);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.link);
    setCopied(true);
    showToast("Link copied", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-black mb-1.5">
        Password Reset Requests
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Look up a member's active reset link to send manually via WhatsApp or SMS.
      </p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="email"
            required
            placeholder="member@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-black placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Look up"}
        </button>
      </form>

      {result && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 mb-2">RESET LINK</p>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 mb-3">
            <p className="flex-1 truncate text-sm text-black">{result.link}</p>
            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Expires: {new Date(result.expiresAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}