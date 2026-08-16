/* ------------------------------------------------------------------ */
/*  Order persistence — writes order metadata to the database after    */
/*  the notification email has been sent.                              */
/*                                                                     */
/*  Fields mirror what checkout stores in the Stripe session metadata  */
/*  (see app/api/stripe/checkout/route.ts).                            */
/*                                                                     */
/*  orderNumber is the order's unique business id (generated at        */
/*  checkout time). Upsert keyed on it keeps the write idempotent      */
/*  when Stripe retries the webhook.                                   */
/* ------------------------------------------------------------------ */

import { prisma } from "./prisma";
import type { OrderEmailPayload } from "./order-email";

export async function saveOrderMetadata(order: OrderEmailPayload): Promise<boolean> {
  const data = {
    // 订单号（唯一）
    orderNumber: order.orderNumber,

    // Stripe Checkout Session ID（demo 订单为 DEMO-*），支付对账用
    stripeSessionId: order.orderRef || null,

    // 客户信息
    customerEmail: order.customer.email || null,
    firstName: order.customer.firstName || null,
    lastName: order.customer.lastName || null,
    address: order.customer.address || null,
    city: order.customer.city || null,
    region: order.customer.region || null,
    postcode: order.customer.postcode || null,
    phone: order.customer.phone || null,

    // 物流信息
    shippingCode: order.shipping.code || null,
    shippingName: order.shipping.name || null,
    shippingPrice: order.shipping.price,

    // 商品信息（每单一款商品）
    productName: order.product.name || null,
    productDetail: order.product.detail || null,
    productQty: order.product.qty,
    productUnitPrice: order.product.unitPrice,
  };

  try {
    await prisma.orderMetadata.upsert({
      where: { orderNumber: order.orderNumber },
      create: data,
      update: data,
    });
    console.log("[orders] Order metadata saved —", order.orderNumber);
    return true;
  } catch (err) {
    // Never break checkout/webhook because the DB write failed.
    console.error("[orders] Failed to save order metadata:", err);
    return false;
  }
}
