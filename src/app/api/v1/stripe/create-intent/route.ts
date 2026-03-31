import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const amount = Number(body.amount ?? 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ message: "Amount must be a positive number" }, { status: 400 });
  }

  if (!env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ clientSecret: `pi_mock_${crypto.randomUUID()}` });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia"
  });

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true
    }
  });

  return NextResponse.json({ clientSecret: intent.client_secret });
}
