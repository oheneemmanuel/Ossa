import { NextRequest } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

  if (hash !== signature) {
    console.error("Invalid Paystack webhook signature");
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event) {
    case "charge.success": {
      const { reference, amount, customer, status } = event.data;

      try {
        const user = await db.user.findUnique({
          where: { email: customer.email },
        });

        if (!user) {
          // Payment succeeded but no matching member — log it so you can
          // investigate manually rather than silently losing the record.
          console.error("No user found for contribution:", customer.email, reference);
          break;
        }

        // Upsert on reference: if Paystack retries this webhook (which it does
        // on any non-200 response), this won't create a duplicate contribution.
        await db.contribution.upsert({
          where: { reference },
          update: {}, // already recorded, nothing to change
          create: {
            reference,
            amount, // stored as-is, in pesewas — matches Paystack's payload
            status,
            userId: user.id,
          },
        });

        console.log("Contribution recorded:", { reference, amount, email: customer.email });
      } catch (err) {
        console.error("Failed to record contribution:", err);
        // Return 500 so Paystack retries — don't swallow DB errors as if it succeeded
        return new Response("DB error", { status: 500 });
      }

      break;
    }

    default:
      console.log("Unhandled Paystack event:", event.event);
  }

  return new Response("OK", { status: 200 });
}