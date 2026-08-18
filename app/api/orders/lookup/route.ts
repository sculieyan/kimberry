import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/orders/lookup?order_number=KB-20260819-ABCDE
 *
 * Look up an order by its order number (the KB-YYYYMMDD-XXXXX id
 * generated at checkout and sent in the confirmation email).
 *
 * Data comes from the order_metadata table, written after the order
 * notification email is sent (see lib/orders.ts).
 */
export async function GET(request: NextRequest) {
  const orderNumber = (request.nextUrl.searchParams.get('order_number') || '')
    .trim()
    .toUpperCase();

  if (!orderNumber) {
    return NextResponse.json(
      { success: false, error: 'Please enter your order number.' },
      { status: 400 },
    );
  }

  try {
    const order = await prisma.orderMetadata.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'We could not find an order with that number. Please check the order number in your confirmation email.' },
        { status: 404 },
      );
    }

    // Prisma Decimal is not JSON-serialisable — convert to plain numbers.
    const shippingPrice = order.shippingPrice === null ? null : Number(order.shippingPrice);
    const productUnitPrice = order.productUnitPrice === null ? null : Number(order.productUnitPrice);

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        placedAt: order.createdAt,
        // DEMO-* session ids mean the order was placed without live Stripe payment.
        demo: (order.stripeSessionId || '').startsWith('DEMO-'),
        customer: {
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.customerEmail,
          phone: order.phone,
        },
        address: {
          street: order.address,
          city: order.city,
          region: order.region,
          postcode: order.postcode,
        },
        shipping: {
          name: order.shippingName,
          price: shippingPrice,
        },
        product: {
          name: order.productName,
          detail: order.productDetail,
          qty: order.productQty,
          unitPrice: productUnitPrice,
        },
      },
    });
  } catch (err) {
    console.error('[orders/lookup] Database error:', err);
    return NextResponse.json(
      { success: false, error: 'Order lookup is temporarily unavailable. Please try again later.' },
      { status: 500 },
    );
  }
}
