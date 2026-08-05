import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { ContributionCard } from "@/components/ui/dashboard/StatCard";
import ContributionPayment from "@/components/ui/dashboard/contributionCard";
import AnnouncementBell from "@/components/ui/dashboard/Announcement";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.email) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F5F1]">
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Header row */}
        <div className="flex items-start justify-between border-b border-[#111C3A]/10 pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#111C3A]">
              Hi, {session.user.firstName}
            </h1>
            <p className="mt-1 text-sm text-[#5B6478]">
              Here's what's happening with your account today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <AnnouncementBell />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111C3A] text-sm font-medium text-white">
              {session.user.firstName?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ContributionCard
            memberName={`${session.user.firstName} ${session.user.lastName}`}
            amountContributed={1500}
            targetAmount={5000}
            lastContributionDate="2023-10-15"
          />
        </div>

        {/* Main content + payment sidebar */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-[#111C3A]/10 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-medium uppercase tracking-wide text-[#5B6478]">
                Recent activity
              </h2>
              <div className="mt-4 flex h-40 items-center justify-center rounded-xl border border-dashed border-[#111C3A]/15 text-sm text-[#5B6478]/70">
                No recent activity yet
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ContributionPayment email={session.user.email} />
          </div>
        </div>
      </main>
    </div>
  );
}
