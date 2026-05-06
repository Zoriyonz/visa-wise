import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  try {
    if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY");
    const stripe = new Stripe(stripeSecretKey);
    const body = (await request.json()) as { id: string };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ quantity: 1, price_data: { currency: "usd", product_data: { name: "Visa-Wise Full Report" }, unit_amount: 999 } }],
      metadata: { analysisId: body.id },
      success_url: `${siteUrl}/results?id=${body.id}`,
      cancel_url: `${siteUrl}/results?id=${body.id}`,
    });
    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
