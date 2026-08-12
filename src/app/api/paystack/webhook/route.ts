import { NextRequest } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  const isValid =
    !!signature &&
    hash.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));

  if (!isValid) {
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
          console.error(
            "No user found for contribution:",
            customer.email,
            reference,
          );
          break;
        }

        // If you pre-create a pending contribution row when you initialize
        // the transaction (recommended), check the amount matches what
        // you expected before trusting it — protects against a tampered
        // client-side amount.
        const existing = await db.contribution.findUnique({
          where: { reference },
        });

        if (existing && existing.amount !== amount) {
          console.error("Amount mismatch on contribution:", {
            reference,
            expected: existing.amount,
            received: amount,
          });
          // Don't silently accept — flag it. Decide your own policy here:
          // you could still upsert but mark it "flagged" for manual review
          // instead of "success".
        }

        await db.contribution.upsert({
          where: { reference },
          update: { status }, // keep status in sync if it was pending before
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
      } catch (err) {
        console.error("Failed to record contribution:", err);
        return new Response("DB error", { status: 500 });
      }

      break;
    }

    case "charge.failed": {
      const { reference, customer } = event.data;
      console.warn("Charge failed:", { reference, email: customer?.email });

      try {
        await db.contribution.updateMany({
          where: { reference },
          data: { status: "failed" },
        });
      } catch (err) {
        console.error("Failed to record failed charge:", err);
        return new Response("DB error", { status: 500 });
      }

      break;
    }

    default:
      console.log("Unhandled Paystack event:", event.event);
  }

  return new Response("OK", { status: 200 });
}
