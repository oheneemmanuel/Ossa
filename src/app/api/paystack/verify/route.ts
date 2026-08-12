// app/api/paystack/verify/route.ts
import { NextRequest } from "next/server";
import { recordContribution } from "@/lib/paystack";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return Response.json(
      { status: false, message: "No reference supplied" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await res.json();

    if (data.status === true && data.data?.status === "success") {
      await recordContribution(data.data);
    }

    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("Paystack verify error:", err);
    return Response.json(
      { status: false, message: "Verification failed" },
      { status: 500 },
    );
  }
}
