"use client";

import React, { useCallback, useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Track Your Order — look up an order by its order number.          */
/*  Queries GET /api/orders/lookup, which reads the order_metadata    */
/*  table. Supports ?order_number=KB-... for direct links.            */
/* ------------------------------------------------------------------ */

interface OrderResult {
  orderNumber: string;
  placedAt: string;
  demo: boolean;
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  };
  address: {
    street: string | null;
    city: string | null;
    region: string | null;
    postcode: string | null;
  };
  shipping: {
    name: string | null;
    price: number | null;
  };
  product: {
    name: string | null;
    detail: string | null;
    qty: number | null;
    unitPrice: number | null;
  };
}

const money = (value: number | null | undefined) =>
  new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(Number(value) || 0);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-NZ', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const lookup = useCallback(async (value: string) => {
    const cleaned = value.trim().toUpperCase();
    if (!cleaned) {
      setMessage('Please enter your order number.');
      return;
    }
    setLoading(true);
    setOrder(null);
    setMessage('Looking up your order…');
    try {
      const response = await fetch(`/api/orders/lookup?order_number=${encodeURIComponent(cleaned)}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'We could not find that order.');
      setOrder(data.order as OrderResult);
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We could not find that order.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-lookup when arriving via ?order_number=KB-...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('order_number');
    if (initial) {
      setOrderNumber(initial);
      lookup(initial);
    }
  }, [lookup]);

  const subtotal = order ? (order.product.unitPrice || 0) * (order.product.qty || 1) : 0;
  const shippingPrice = order?.shipping.price ?? 0;
  const total = subtotal + shippingPrice;
  const customerName = [order?.customer.firstName, order?.customer.lastName].filter(Boolean).join(' ');
  const addressLine = [order?.address.street, order?.address.city, order?.address.region, order?.address.postcode]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      {/* Spacer: pushes the hero below the fixed 80px navbar.
          Must stay OUTSIDE .track-page — the scoped reset
          `.track-page *{margin:0;padding:0}` would otherwise
          override Tailwind's py-10 and collapse this to zero height. */}
      <section className="relative py-10" aria-hidden="true"></section>

      <div className="track-page">
      <style>{`
        .track-page{
          --ink:#0E1C2E;
          --muted:#5F6E80;
          --forest:#1C3A5E;
          --oat:#C2A15D;
          --mist:#F7F9F6;
          color:var(--ink);
          font-family:'Outfit',sans-serif;
          line-height:1.65;
        }
        .track-page *{box-sizing:border-box;margin:0;padding:0}

        .track-hero{
          width:100vw;
          padding:52px 6vw 56px; /* +80px spacer above = 132px total, clears navbar */
          background:
            radial-gradient(circle at 82% 12%,rgba(194,161,93,.16),transparent 30%),
            linear-gradient(135deg,#EEF4EA,#D7E5CF);
        }
        .track-hero-content{max-width:640px}
        .track-hero-content span{
          display:inline-flex;
          height:30px;
          padding:0 14px;
          align-items:center;
          border-radius:999px;
          background:rgba(28,58,94,.08);
          border:1px solid rgba(28,58,94,.12);
          font-size:11px;
          font-weight:650;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:var(--forest);
          margin-bottom:18px;
        }
        .track-hero-content h1{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(38px,4.4vw,60px);
          line-height:.98;
          letter-spacing:-.05em;
          font-weight:300;
          margin-bottom:16px;
        }
        .track-hero-content p{
          max-width:520px;
          color:var(--muted);
          font-size:15px;
        }

        .track-main{
          background:
            radial-gradient(circle at 12% 12%,rgba(194,161,93,.10),transparent 28%),
            linear-gradient(180deg,#FFFFFF 0%,var(--mist) 100%);
          padding:64px 6vw 96px;
        }
        .track-shell{max-width:880px;margin:0 auto}

        .lookup-card{
          background:rgba(255,255,255,.85);
          border:1px solid rgba(28,58,94,.07);
          border-radius:34px;
          padding:42px;
          box-shadow:0 22px 62px rgba(28,58,94,.055);
        }
        .lookup-card h2{
          font-family:'Cormorant Garamond',serif;
          font-size:34px;
          line-height:1;
          font-weight:400;
          letter-spacing:-.04em;
          margin-bottom:22px;
        }
        .lookup-form{display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap}
        .lookup-field{flex:1;min-width:240px}
        .lookup-field label{
          display:block;
          font-size:12px;
          font-weight:650;
          letter-spacing:.08em;
          text-transform:uppercase;
          color:var(--forest);
          margin-bottom:8px;
        }
        .lookup-field input{
          width:100%;
          height:52px;
          padding:0 18px;
          border-radius:16px;
          border:1px solid rgba(14,28,46,.14);
          background:#fff;
          font-family:'Outfit',sans-serif;
          font-size:15px;
          color:var(--ink);
          outline:none;
          transition:border-color .2s, box-shadow .2s;
        }
        .lookup-field input:focus{
          border-color:var(--forest);
          box-shadow:0 0 0 4px rgba(28,58,94,.08);
        }
        .lookup-btn{
          height:52px;
          padding:0 28px;
          border:none;
          border-radius:999px;
          background:var(--forest);
          color:#fff;
          font-family:'Outfit',sans-serif;
          font-size:14px;
          font-weight:650;
          letter-spacing:.02em;
          cursor:pointer;
          transition:background .2s, transform .2s;
        }
        .lookup-btn:hover:not(:disabled){background:#2A5282;transform:translateY(-1px)}
        .lookup-btn:disabled{opacity:.6;cursor:wait}
        .form-message{
          margin-top:16px;
          font-size:14px;
          color:#B4532A;
          min-height:20px;
        }

        .order-panel{margin-top:28px}
        .order-heading{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:16px;
          margin-bottom:20px;
        }
        .order-heading .eyebrow{
          font-size:11px;
          font-weight:650;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:var(--oat);
          margin-bottom:6px;
        }
        .order-heading h2{
          font-family:'Cormorant Garamond',serif;
          font-size:36px;
          line-height:1;
          font-weight:400;
          letter-spacing:-.03em;
        }
        .order-heading .muted{color:var(--muted);font-size:14px;margin-top:8px}
        .status-pill{
          display:inline-flex;
          align-items:center;
          height:34px;
          padding:0 16px;
          border-radius:999px;
          background:#E7F2E8;
          border:1px solid #CFE5D2;
          color:#2F6B3C;
          font-size:12px;
          font-weight:650;
          letter-spacing:.06em;
          text-transform:uppercase;
          white-space:nowrap;
        }

        .panel-grid{
          display:grid;
          grid-template-columns:1.4fr 1fr;
          gap:20px;
        }
        .panel-card{
          background:rgba(255,255,255,.85);
          border:1px solid rgba(28,58,94,.07);
          border-radius:28px;
          padding:30px;
          box-shadow:0 18px 48px rgba(28,58,94,.05);
        }
        .panel-card h3{
          font-family:'Cormorant Garamond',serif;
          font-size:24px;
          font-weight:400;
          letter-spacing:-.02em;
          margin-bottom:18px;
        }
        .panel-card p{font-size:14px;color:var(--ink)}
        .panel-card .muted{color:var(--muted);font-size:14px;margin-top:6px}

        .order-item{
          display:flex;
          justify-content:space-between;
          gap:16px;
          padding:14px 0;
          border-bottom:1px dashed rgba(14,28,46,.12);
          font-size:14px;
        }
        .order-item small{display:block;color:var(--muted);margin-top:4px}
        .order-item strong{white-space:nowrap}

        .money-list{margin-top:14px;font-size:14px}
        .money-list > div{
          display:flex;
          justify-content:space-between;
          padding:8px 0;
          color:var(--muted);
        }
        .money-list .total-row{
          border-top:1px solid rgba(14,28,46,.12);
          margin-top:6px;
          padding-top:14px;
          color:var(--ink);
          font-weight:650;
          font-size:16px;
        }

        @media(max-width:820px){
          .panel-grid{grid-template-columns:1fr}
          .track-hero{padding:28px 28px 44px} /* +80px spacer = 108px total */
          .track-main{padding:44px 6vw 72px}
          .lookup-card{padding:30px}
        }
      `}</style>

      <section className="track-hero">
        <div className="track-hero-content">
          <span>Order Support</span>
          <h1>Track your order</h1>
          <p>Enter the order number from your confirmation email to see your order details and delivery information.</p>
        </div>
      </section>

      <main className="track-main">
        <div className="track-shell">
          <section className="lookup-card" aria-labelledby="lookup-title">
            <h2 id="lookup-title">Find your order</h2>
            <form
              className="lookup-form"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                lookup(orderNumber);
              }}
            >
              <div className="lookup-field">
                <label htmlFor="order-number">Order number</label>
                <input
                  id="order-number"
                  name="orderNumber"
                  autoComplete="off"
                  placeholder="e.g. KB-20260819-ABCDE"
                  value={orderNumber}
                  onChange={(event) => setOrderNumber(event.target.value)}
                  required
                />
              </div>
              <button className="lookup-btn" type="submit" disabled={loading}>
                {loading ? 'Searching…' : 'Find my order'}
              </button>
            </form>
            <p className="form-message" role="status" aria-live="polite">{message}</p>
          </section>

          {order && (
            <section className="order-panel" aria-live="polite">
              <div className="order-heading">
                <div>
                  <p className="eyebrow">Your Order</p>
                  <h2>{order.orderNumber}</h2>
                  <p className="muted">Placed {formatDate(order.placedAt)}</p>
                </div>
                <span className="status-pill">{order.demo ? 'Demo order' : 'Order confirmed'}</span>
              </div>

              <div className="panel-grid">
                <article className="panel-card">
                  <h3>Order summary</h3>
                  <div className="order-item">
                    <div>
                      <p>{order.product.name || 'Kimberry product'}</p>
                      {order.product.detail && <small>{order.product.detail}</small>}
                      <small>Quantity {order.product.qty || 1}</small>
                    </div>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  <dl className="money-list">
                    <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
                    <div>
                      <dt>Shipping{order.shipping.name ? ` — ${order.shipping.name}` : ''}</dt>
                      <dd>{shippingPrice ? money(shippingPrice) : 'FREE'}</dd>
                    </div>
                    <div className="total-row"><dt>Total</dt><dd>{money(total)}</dd></div>
                  </dl>
                </article>

                <article className="panel-card">
                  <h3>Delivery details</h3>
                  <p>{customerName || 'Kimberry customer'}</p>
                  {addressLine && <p className="muted">{addressLine}</p>}
                  {order.customer.email && <p className="muted">{order.customer.email}</p>}
                  {order.customer.phone && <p className="muted">{order.customer.phone}</p>}
                </article>
              </div>
            </section>
          )}
        </div>
      </main>
      </div>
    </>
  );
}
