import type { ReactNode } from "react";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import Sidebar from "@/components/ui/dashboard/Sidebar";
import { isWheelEnabled } from "@/lib/actions/settings";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      firstName: true,
      lastName: true,
      role: true,
      profileImageUrl: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Since this is the admin layout, only admins get in
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const wheelEnabled = await isWheelEnabled();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* 1. Left Side Navigation */}
      <Sidebar user={user} wheelEnabled={wheelEnabled} />

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