// app/dashboard/settings/page.tsx
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import SettingsForm from "@/components/ui/dashboard/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mt-8">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account profile, personal details, and preferences.
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}