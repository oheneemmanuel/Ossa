import { redirect } from "next/navigation";
import { auth } from "@/auth.config";
import { db } from "@/lib/prisma";
import WheelClient from "@/components/ui/dashboard/WheelClient";

export const dynamic = "force-dynamic";

export default async function WheelPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/api/auth/signin?callbackUrl=/wheel");

  const today = new Date().toISOString().slice(0, 10);

  const [prizes, todaysSpin] = await Promise.all([
    // Only public fields go to the browser: never weight or stock.
    db.prize.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, label: true, color: true },
    }),
    db.spin.findUnique({
      where: { userId_dayKey: { userId, dayKey: today } },
      select: {code: true, prize: { select: { label: true, dataMb: true } } },
    }),
  ]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center gap-8 px-6 py-12 text-slate-50">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Spin for free data</h1>
        <p className="mt-2 text-blue-500">
          One spin a day. Your bundle is credited to your line.
        </p>
      </header>
      <WheelClient prizes={prizes} alreadyWon={todaysSpin?.prize.label ?? null} alreadyWonDataMb={todaysSpin?.prize.dataMb ?? null} 
      alreadyWonCode={todaysSpin?.code ?? null}
      userName={session?.user?.firstName ?? null} />
    </main>
  );
}