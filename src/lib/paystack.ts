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

  await db.contribution.upsert({
    where: { reference },
    update: { status },
    create: {
      reference,
      amount,
      status,
      userId: user.id,
    },
  });

  console.log("Contribution recorded:", {
    reference,
    amount,
    email: customer.email,
  });
  return { recorded: true };
}
