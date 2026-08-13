// lib/paystack.ts
import { db } from "@/lib/prisma";

interface PaystackChargeData {
  reference: string;
  amount: number;
  status: string;
  customer: { email: string };
}

export async function recordContribution(data: PaystackChargeData) {
  const { reference, amount, status, customer } = data;

  if (status !== "success") return { recorded: false, reason: "not_success" };

  const user = await db.user.findUnique({ where: { email: customer.email } });

  if (!user) {
    console.error("No user found for contribution:", customer.email, reference);
    return { recorded: false, reason: "no_user" };
  }

  const activeProject = await db.project.findFirst({
    where: { isActive: true },
  });

  if (!activeProject) {
    console.error("No active project found for contribution:", reference);
    return { recorded: false, reason: "no_active_project" };
  }

  await db.contribution.upsert({
    where: { reference },
    update: { status },
    create: {
      reference,
      amount,
      status,
      userId: user.id,
      projectId: activeProject.id,
    },
  });

  console.log("Contribution recorded:", {
    reference,
    amount,
    email: customer.email,
    project: activeProject.name,
  });
  return { recorded: true };
}