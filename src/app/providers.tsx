"use client";

import { ToastProvider } from "@/components/providers/ToastProvider";
import { SessionProvider } from "next-auth/react";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}