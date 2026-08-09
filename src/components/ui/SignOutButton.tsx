// components/SignOutButton.tsx
"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}