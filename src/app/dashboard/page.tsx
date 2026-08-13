import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import Image from "next/image";
import { ContributionCard } from "@/components/ui/dashboard/StatCard";
import AnnouncementBell from "@/components/ui/dashboard/Announcement";
import ActionItems from "@/components/ui/dashboard/ActionItems";
import RecentTransaction from "@/components/ui/dashboard/RecentTransactions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  if (!session.user.email) {
    redirect("/login");
  }
  console.log(session?.user?.role);

  // Fetch the real, current user record instead of trusting the session snapshot —
  // the session's firstName/lastName can go stale after a settings update.
  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const contributions = await db.contribution.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const activeProject = await db.project.findFirst({
    where: { isActive: true },
  });

  const totalPesewas = contributions.reduce((sum, c) => sum + c.amount, 0);
  const amountContributed = totalPesewas / 100;
  const lastContributionDate =
    contributions[0]?.createdAt.toISOString().split("T")[0] ?? null;

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    "U";

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div className="min-h-screen bg-[#F7F5F1]">
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Header row */}
        <div className="flex items-start justify-between border-b border-[#111C3A]/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#111C3A]">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[#111C3A]">
                Hi, {user.firstName}
              </h1>
              <p className="mt-1 text-sm text-[#5B6478]">
                Here's what's happening with your account today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AnnouncementBell />
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ContributionCard
            memberName={`${user.firstName} ${user.lastName}`}
            amountContributed={amountContributed}
            lastContributionDate={
              lastContributionDate ?? "No contributions yet"
            }
          />
        </div>

        {/* Action items — its own full-width section */}
        <div className="mt-8">
          <ActionItems
            email={user.email}
            projectName={activeProject?.name ?? "General Fund"}
          />
        </div>

        {/* Recent activity — its own full-width section */}
        <div className="mt-8">
          <RecentTransaction contributions={contributions} />
        </div>
      </main>
    </div>
  );
}
