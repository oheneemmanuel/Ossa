import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import TransactionsTable from "@/components/ui/finance/TransactionTable";

export default async function TransactionsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

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

  return <TransactionsTable initialData={contributions} />;
}