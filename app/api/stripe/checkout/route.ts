import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { findProduct } from '@/lib/products';
import { sendOrderNotificationEmail } from '@/lib/order-email';

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session (hosted payment page, NZD) and
 * returns { url } for the client to redirect to.
 *
 * - Product prices are re-derived server-side from lib/products.ts —
 *   the client only sends product ids and quantities.
 * - The selected NZ Post rate is attached as a Stripe shipping option.
 * - When STRIPE_SECRET_KEY is not configured, returns { demo: true } so
 *   the client can fall back to the simulated order flow.
 */
export async function POST(request: NextRequest) {
  let body: {
    items?: { id: string; qty: number }[];
    shipping?: { product: string; code: string; speed: string; price: number } | null;
    customer?: {
      email?: string; firstName?: string; lastName?: string;
      address?: string; city?: string; region?: string; postcode?: string; phone?: string;
    };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  /* ---- re-price the basket server-side ---- */
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const item of Array.isArray(body?.items) ? body.items : []) {
    const product = findProduct(String(item?.id || ''));
    if (!product) continue;
    const qty = Math.max(1, Math.min(99, Math.floor(Number(item.qty) || 1)));
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: 'nzd',
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: `${product.name} — ${product.category}`,
          description: product.size,
          metadata: { productId: product.id },
        },
      },
    });
  }
  if (lineItems.length === 0) {
    return NextResponse.json({ error: 'No valid items in the order.' }, { status: 400 });
  }

  /* ---- demo fallback when Stripe is not configured ---- */
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // Simulated order — notify the merchant inbox with the full order detail.
    const demoItems = (Array.isArray(body?.items) ? body.items : [])
      .map(item => {
        const product = findProduct(String(item?.id || ''));
        if (!product) return null;
        const qty = Math.max(1, Math.min(99, Math.floor(Number(item.qty) || 1)));
        return { name: `${product.name} — ${product.category}`, detail: product.size, qty, unitPrice: product.price };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    const demoItemsTotal = demoItems.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
    const demoShipping = body?.shipping && Number(body.shipping.price) > 0
      ? { name: `${body.shipping.product} (${body.shipping.speed})`, code: body.shipping.code, price: Number(body.shipping.price) }
      : { name: 'NZ Post delivery — Free shipping', code: 'FREE', price: 0 };
    await sendOrderNotificationEmail({
      orderRef: `DEMO-${Date.now().toString(36).toUpperCase()}`,
      demo: true,
      customer: body?.customer || {},
      items: demoItems,
      shipping: demoShipping,
      itemsTotal: demoItemsTotal,
      grandTotal: demoItemsTotal + demoShipping.price,
    });
    return NextResponse.json({ demo: true, message: 'STRIPE_SECRET_KEY not configured — demo checkout.' });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get('origin') ||
    'http://localhost:3000';

  /* ---- NZ Post rate as a Stripe shipping option ---- */
  const shipping = body?.shipping;
  const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
    shipping && Number(shipping.price) > 0
      ? [{
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(Number(shipping.price) * 100), currency: 'nzd' },
            display_name: `${shipping.product} (${shipping.speed})`,
            metadata: { code: shipping.code || '' },
          },
        }]
      : [{
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'nzd' },
            display_name: 'NZ Post delivery — Free shipping',
          },
        }];

  const customer = body?.customer || {};

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customer.email || undefined,
      line_items: lineItems,
      shipping_options: shippingOptions,
      success_url: `${origin}/shop?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop?checkout=cancelled`,
      metadata: {
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        address: customer.address || '',
        city: customer.city || '',
        region: customer.region || '',
        postcode: customer.postcode || '',
        phone: customer.phone || '',
        shippingCode: shipping?.code || 'FREE',
        shippingName: shipping ? `${shipping.product} (${shipping.speed})` : 'NZ Post delivery — Free shipping',
        shippingPrice: String(Number(shipping?.price) || 0),
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not create the Stripe checkout session.' },
      { status: 500 },
    );
  }
}
