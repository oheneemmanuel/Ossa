// app/dashboard/settings/page.tsx
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import SettingsForm from "@/components/ui/dashboard/SettingsForm";
import DeleteAccountButton from "@/components/ui/dashboard/DeleteAction";

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

  // Generate user initials for avatar fallback
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 text-black sm:text-3xl">
          Account Settings
        </h1>
        <p className="mt-2 text-sm text-zinc-600 text-black ">
          Manage your personal information, update contact details, and manage account security.
        </p>
      </div>

      {/* User Quick Overview Card */}
      <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white shadow dark:bg-zinc-100 text-black-900">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-zinc-900 text-black-100">
            {user.firstName} {user.lastName}
          </h2>
          <p className="truncate text-sm text-zinc-500 text-black-400">{user.email}</p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400">
          Active Account
        </span>
      </div>

      {/* Profile Form Section */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <div className="mb-6 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 text-black-100">
            Personal Details
          </h2>
          <p className="text-xs text-zinc-500 text-black-400">
            Update your public profile and contact preferences.
          </p>
        </div>

        <SettingsForm user={user} />
      </section>

      {/* Danger Zone Section */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="text-xs text-black">
            Ensure you know what you are doing 
          </p>
        </div>

        <DeleteAccountButton />
      </section>
    </div>
  );
}