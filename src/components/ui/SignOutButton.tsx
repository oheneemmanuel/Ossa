// components/SignOutButton.tsx
"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

export default function SignOutButton() {
  const { showToast } = useToast();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;

    const timer = window.setTimeout(() => setConfirming(false), 5000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const handleSignOut = async () => {
    if (!confirming) {
      showToast("Are you sure you want to logout? Click again to confirm.", "info");
      setConfirming(true);
      return;
    }

    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      className={`flex items-center gap-2 text-sm font-semibold transition ${
        confirming ? "text-red-600 hover:text-red-800" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <LogOut className="h-4 w-4" />
      {confirming ? "Confirm Logout" : "Sign out"}
    </button>
  );
}