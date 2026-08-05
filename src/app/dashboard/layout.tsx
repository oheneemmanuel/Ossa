
import type { ReactNode } from "react";
import Sidebar from "@/components/ui/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* 1. Left Side Navigation */}
      <Sidebar />

      {/* 2. Main Right Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        

        {/* Dynamic Inner Content Pages */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}