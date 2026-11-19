export const runtime = "nodejs";

import Stripe from "stripe";

import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return new Response("Stripe not configured", { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const analysisId = session.metadata?.analysisId;
    if (analysisId && supabase) {
      await supabase.from("intake_submissions").update({ paid: true }).eq("id", analysisId);
    }
  }

  return new Response("ok", { status: 200 });
}
