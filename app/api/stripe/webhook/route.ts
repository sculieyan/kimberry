import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

/**
 * POST /api/stripe/webhook
 *
 * Stripe webhook endpoint — the authoritative "payment succeeded" signal.
 * Configure in the Stripe dashboard (Developers → Webhooks):
 *   URL:    https://your-domain/api/stripe/webhook
 *   Events: checkout.session.completed
 * then set STRIPE_WEBHOOK_SECRET (whsec_...) in the environment.
 *
 * Until an order database is wired in, confirmed payments are logged here;
 * fulfilment (save order, send email, create NZ Post label) hooks in below.
 */
export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ received: false, message: 'Stripe webhook not configured.' });
  }

  const signature = (await headers()).get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    // TODO: fulfil the order — persist to database, send confirmation email,
    // create the NZ Post shipment with session.metadata.shippingCode, etc.
    console.log('Stripe payment confirmed:', {
      sessionId: session.id,
      amountTotal: session.amount_total,
      currency: session.currency,
      email: session.customer_email,
      metadata: session.metadata,
    });
  }

  return NextResponse.json({ received: true });
}
