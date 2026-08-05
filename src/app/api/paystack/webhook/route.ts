import { NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  // Paystack sends the raw body — read as text first for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  // Verify the request genuinely came from Paystack
  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    console.error("Invalid Paystack webhook signature");
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event) {
    case "charge.success": {
      const { reference, amount, customer } = event.data;

      // TODO: update your DB here — mark contribution as paid,
      // using `reference` to match it to the transaction you initiated.
      // amount is in kobo/pesewas, divide by 100 for main currency unit.
      console.log("Payment confirmed via webhook:", {
        reference,
        amount: amount / 100,
        email: customer.email,
      });

      break;
    }

    // Add other event types as needed, e.g. "charge.failed", "transfer.success"
    default:
      console.log("Unhandled Paystack event:", event.event);
  }

  // Paystack expects a 200 quickly — don't do slow work before responding
  return new Response("OK", { status: 200 });
}
