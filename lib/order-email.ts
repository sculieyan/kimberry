/* ------------------------------------------------------------------ */
/*  Order notification email                                           */
/*                                                                     */
/*  Sends an HTML order summary (customer details, items, shipping     */
/*  method and totals) to the merchant inbox after a payment is        */
/*  confirmed — or when a demo order is placed.                        */
/*                                                                     */
/*  Environment variables:                                             */
/*    ORDER_NOTIFY_EMAIL  recipient inbox (default 1695658171@qq.com)  */
/*    SMTP_HOST           default smtp.qq.com                          */
/*    SMTP_PORT           default 465 (SSL)                            */
/*    SMTP_USER           SMTP login, e.g. your@qq.com                 */
/*    SMTP_PASS           SMTP password / QQ Mail authorisation code   */
/*                                                                     */
/*  If SMTP_USER/SMTP_PASS are missing, sending is skipped with a      */
/*  warning so checkout keeps working.                                 */
/* ------------------------------------------------------------------ */

import nodemailer from 'nodemailer';

export interface OrderEmailItem {
  name: string;
  detail?: string;
  qty: number;
  unitPrice: number; // NZD
}

export interface OrderEmailPayload {
  orderRef: string;
  demo?: boolean;
  customer: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    region?: string;
    postcode?: string;
  };
  items: OrderEmailItem[];
  shipping: {
    name: string;   // e.g. "Courier (1-3 working days)" or "Free shipping"
    code?: string;
    price: number;  // NZD
  };
  itemsTotal: number;   // NZD
  grandTotal: number;   // NZD (items + shipping)
  paidAt?: Date;
}

const nzd = (n: number) => `NZ$${n.toFixed(2)}`;

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function buildOrderEmailHtml(order: OrderEmailPayload): string {
  const c = order.customer;
  const itemRows = order.items.map(it => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;">
          <strong>${escapeHtml(it.name)}</strong>
          ${it.detail ? `<div style="color:#888;font-size:12px;">${escapeHtml(it.detail)}</div>` : ''}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${it.qty}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${nzd(it.unitPrice)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${nzd(it.unitPrice * it.qty)}</td>
      </tr>`).join('');

  const customerLine = (label: string, value?: string) =>
    value ? `<tr><td style="padding:4px 12px;color:#888;width:110px;">${label}</td><td style="padding:4px 12px;">${escapeHtml(value)}</td></tr>` : '';

  const fullAddress = [c.address, c.city, c.region, c.postcode].filter(Boolean).join(', ');

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#f6f4ef;font-family:-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#333;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8e4da;">
    <div style="background:#6b7a5e;color:#fff;padding:18px 24px;">
      <div style="font-size:18px;font-weight:700;">Kimberry — ${order.demo ? 'Demo Order' : 'New Paid Order'}</div>
      <div style="font-size:12px;opacity:.85;margin-top:4px;">${escapeHtml(order.orderRef)} · ${(order.paidAt || new Date()).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })} (NZT)</div>
    </div>

    <div style="padding:20px 24px;">
      <h3 style="margin:0 0 8px;font-size:14px;color:#6b7a5e;">Customer</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;background:#faf9f5;border-radius:8px;">
        ${customerLine('Name', [c.firstName, c.lastName].filter(Boolean).join(' ') || undefined)}
        ${customerLine('Email', c.email)}
        ${customerLine('Phone', c.phone)}
        ${customerLine('Address', fullAddress || undefined)}
      </table>

      <h3 style="margin:20px 0 8px;font-size:14px;color:#6b7a5e;">Items</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr style="background:#faf9f5;color:#888;text-align:left;">
          <th style="padding:8px 12px;">Product</th>
          <th style="padding:8px 12px;text-align:center;">Qty</th>
          <th style="padding:8px 12px;text-align:right;">Unit</th>
          <th style="padding:8px 12px;text-align:right;">Subtotal</th>
        </tr>
        ${itemRows}
      </table>

      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:12px;">
        <tr>
          <td style="padding:6px 12px;color:#888;">Shipping — ${escapeHtml(order.shipping.name)}${order.shipping.code ? ` (${escapeHtml(order.shipping.code)})` : ''}</td>
          <td style="padding:6px 12px;text-align:right;">${order.shipping.price > 0 ? nzd(order.shipping.price) : 'FREE'}</td>
        </tr>
        <tr>
          <td style="padding:6px 12px;color:#888;">Items total</td>
          <td style="padding:6px 12px;text-align:right;">${nzd(order.itemsTotal)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;font-size:15px;font-weight:700;">Total (NZD)</td>
          <td style="padding:10px 12px;font-size:15px;font-weight:700;text-align:right;">${nzd(order.grandTotal)}</td>
        </tr>
      </table>
    </div>

    <div style="padding:14px 24px;background:#faf9f5;color:#999;font-size:11px;">
      ${order.demo ? 'Demo order — Stripe is not configured, no real payment was taken.' : 'Payment confirmed via Stripe.'}
    </div>
  </div>
</body></html>`;
}

export async function sendOrderNotificationEmail(order: OrderEmailPayload): Promise<boolean> {
  const to = process.env.ORDER_NOTIFY_EMAIL || '1695658171@qq.com';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.warn('[order-email] SMTP_USER/SMTP_PASS not configured — order email skipped:', order.orderRef);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.qq.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  });

  const itemSummary = order.items.map(i => `${i.name} x${i.qty}`).join(', ');
  try {
    await transporter.sendMail({
      from: `"Kimberry Orders" <${user}>`,
      to,
      subject: `${order.demo ? '[DEMO] ' : ''}New order ${order.orderRef} — ${nzd(order.grandTotal)}`,
      text:
        `Order ${order.orderRef}\n` +
        `Customer: ${[order.customer.firstName, order.customer.lastName].filter(Boolean).join(' ')} <${order.customer.email || ''}>\n` +
        `Phone: ${order.customer.phone || '-'}\n` +
        `Address: ${[order.customer.address, order.customer.city, order.customer.region, order.customer.postcode].filter(Boolean).join(', ')}\n` +
        `Items: ${itemSummary}\n` +
        `Shipping: ${order.shipping.name} — ${order.shipping.price > 0 ? nzd(order.shipping.price) : 'FREE'}\n` +
        `Total: ${nzd(order.grandTotal)} NZD`,
      html: buildOrderEmailHtml(order),
    });
    console.log('[order-email] Order notification sent to', to, '—', order.orderRef);
    return true;
  } catch (err) {
    // Never break checkout/webhook because the email failed.
    console.error('[order-email] Failed to send order notification:', err);
    return false;
  }
}
