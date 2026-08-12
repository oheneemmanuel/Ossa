// app/api/paystack/webhook/route.ts
import { NextRequest } from "next/server";
import crypto from "crypto";
import {db} from "@/lib/prisma"
import { recordContribution } from "@/lib/paystack";

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

  const isValid =
    !!signature &&
    hash.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));

  if (!isValid) {
    console.error("Invalid Paystack webhook signature");
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);

  try {
    switch (event.event) {
      case "charge.success":
        await recordContribution(event.data);
        break;

      case "charge.failed": {
        const { reference, customer } = event.data;
        console.warn("Charge failed:", { reference, email: customer?.email });
        await db.contribution.updateMany({
          where: { reference },
          data: { status: "failed" },
        });
        break;
      }

      default:
        console.log("Unhandled Paystack event:", event.event);
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response("DB error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}