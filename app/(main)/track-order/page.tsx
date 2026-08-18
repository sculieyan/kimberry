"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Track Your Order — look up an order by order number.               */
/*  Queries GET /api/orders/lookup, which reads the order_metadata     */
/*  table. Supports ?order_number=KB-... for direct links.             */
/*  Visual design mirrors the v7 order-query.html reference (no        */
/*  webfonts — system sans body + Georgia serif headings, exactly      */
/*  like the reference file which loads no Google Fonts).              */
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
  const panelRef = useRef<HTMLElement | null>(null);

  const lookup = useCallback(async (orderValue: string) => {
    const cleanedOrder = orderValue.trim().toUpperCase();
    if (!cleanedOrder) {
      setMessage('Please enter your order number.');
      return;
    }
    setLoading(true);
    setOrder(null);
    setMessage('Looking up your order…');
    try {
      const params = new URLSearchParams({ order_number: cleanedOrder });
      const response = await fetch(`/api/orders/lookup?${params.toString()}`);
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
    const initialOrder = params.get('order_number');
    if (initialOrder) {
      setOrderNumber(initialOrder);
      lookup(initialOrder);
    }
  }, [lookup]);

  // Smooth-scroll to the order panel once it renders, leaving room for
  // the fixed 80px navbar so the panel title doesn't slide underneath it.
  useEffect(() => {
    if (order && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      const targetTop = rect.top + window.scrollY - 100; // 80px navbar + 20px buffer
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  }, [order]);

  const subtotal = order ? (order.product.unitPrice || 0) * (order.product.qty || 1) : 0;
  const shippingPrice = order?.shipping.price ?? 0;
  const total = subtotal + shippingPrice;
  const customerName = [order?.customer.firstName, order?.customer.lastName].filter(Boolean).join(' ');
  const addressLine = [order?.address.street, order?.address.city, order?.address.region, order?.address.postcode]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      {/* Spacer: pushes the page below the fixed 80px navbar.
          Must stay OUTSIDE .track-page — the scoped reset
          `.track-page *{margin:0;padding:0}` would otherwise
          override Tailwind's py-10 and collapse this to zero height. */}
      <section className="relative py-10" aria-hidden="true"></section>

      <main className="track-page">
        {/* Fonts match the reference order-query.html, which loads no
            webfonts: system sans-serif body + Georgia serif headings.
            NOTE: we deliberately use plain `sans-serif` (not the
            reference's 'Outfit',sans-serif stack) because Next dev
            aggregates all route CSS into one stylesheet — the home
            page's Google Fonts @import loads Outfit globally, and real
            Outfit renders heavier than the reference's Helvetica
            fallback. */}
        <style>{`
          .track-page{
            --ink:#20231f;
            --muted:#6e756f;
            --line:#e6e8e4;
            --cream:#f7f6f1;
            --green:#2f5f4b;
            --red:#9d3e35;
            color:var(--ink);
            font-family:sans-serif;
            line-height:1.6;
            background:#fff;
            -webkit-font-smoothing:antialiased;
          }
          .track-page *{box-sizing:border-box;margin:0;padding:0}

          .track-shell{max-width:1120px;margin:auto;padding:70px 24px 100px}

          .track-hero{text-align:center;max-width:700px;margin:0 auto 38px}
          .track-page .eyebrow{
            font-size:12px;
            letter-spacing:.18em;
            font-weight:700;
            color:var(--green);
            margin:0 0 12px;
          }
          .track-hero h1{
            font:500 clamp(36px,5vw,58px)/1.05 Georgia,serif;
            margin:0 0 18px;
            color:var(--ink);
          }
          .track-hero>p:last-child{color:var(--muted);font-size:17px;line-height:1.6}

          .lookup-card,.order-panel{
            background:#fff;
            border:1px solid var(--line);
            border-radius:22px;
            box-shadow:0 18px 50px rgba(31,39,33,.07);
          }
          .lookup-card{max-width:720px;margin:auto;padding:32px}
          .lookup-card h2{font:500 25px Georgia,serif;margin:0 0 22px}
          .lookup-form{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:end}
          .lookup-field{
            font-size:13px;
            font-weight:700;
            color:#3e443f;
            display:grid;
            gap:8px;
          }
          .lookup-field input{
            width:100%;
            border:1px solid #cfd4cf;
            border-radius:10px;
            padding:13px 14px;
            font:inherit;
            font-weight:400;
            background:#fff;
            outline:none;
          }
          .lookup-field input:focus{border-color:var(--green)}
          .lookup-btn{
            border-radius:999px;
            padding:13px 19px;
            font-weight:700;
            font-size:14px;
            cursor:pointer;
            border:1px solid var(--green);
            background:var(--green);
            color:#fff;
          }
          .lookup-btn:disabled{opacity:.6;cursor:wait}
          .form-message{grid-column:1/-1;margin:2px 0 0;color:var(--red);font-size:13px}

          .order-panel{margin-top:34px;padding:34px}
          .order-heading{
            display:flex;
            justify-content:space-between;
            gap:20px;
            align-items:flex-start;
            padding-bottom:26px;
            border-bottom:1px solid var(--line);
          }
          .order-heading h2{font:500 28px Georgia,serif;margin:0 0 8px}
          .track-page .muted{color:var(--muted);line-height:1.55}
          .status-pill{
            display:inline-flex;
            padding:9px 14px;
            border-radius:999px;
            background:#e8f2ec;
            color:var(--green);
            font-size:12px;
            font-weight:800;
            text-transform:uppercase;
            letter-spacing:.08em;
            white-space:nowrap;
          }

          .panel-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:20px;margin-top:24px}
          .panel-card{border:1px solid var(--line);border-radius:16px;padding:24px;background:#fff}
          .panel-card h3{font:500 21px Georgia,serif;margin:0 0 20px}
          .panel-grid .delivery-card{grid-column:1/-1}

          .timeline{list-style:none;margin:0;padding:0}
          .timeline li{position:relative;padding:0 0 28px 38px;color:var(--muted)}
          .timeline li:before{
            content:"";
            position:absolute;
            left:4px;
            top:2px;
            width:17px;
            height:17px;
            border-radius:50%;
            border:2px solid #cbd1cb;
            background:#fff;
          }
          .timeline li:after{
            content:"";
            position:absolute;
            left:13px;
            top:21px;
            width:1px;
            height:calc(100% - 18px);
            background:#d9ddd9;
          }
          .timeline li:last-child:after{display:none}
          .timeline li.complete{color:var(--ink);font-weight:700}
          .timeline li.complete:before{
            background:var(--green);
            border-color:var(--green);
            box-shadow:inset 0 0 0 4px white;
          }
          .timeline li.current:before{border-color:var(--green);box-shadow:0 0 0 5px #e8f2ec}
          .timeline small{display:block;margin-top:5px;color:var(--muted);font-weight:400}

          .order-items{display:grid;gap:14px}
          .order-item{
            display:flex;
            justify-content:space-between;
            gap:15px;
            border-bottom:1px solid var(--line);
            padding-bottom:12px;
          }
          .order-item p{margin:0}
          .order-item small{color:var(--muted)}
          .money-list{margin:18px 0 0}
          .money-list>div{display:flex;justify-content:space-between;padding:7px 0}
          .money-list dt,.money-list dd{margin:0}
          .total-row{
            border-top:1px solid var(--line);
            margin-top:8px;
            padding-top:15px!important;
            font-weight:800;
          }

          @media(max-width:800px){
            .lookup-form{grid-template-columns:1fr}
            .panel-grid{grid-template-columns:1fr}
            .order-panel{padding:22px}
          }
          @media(max-width:520px){
            .track-shell{padding:45px 16px 70px}
            .lookup-card{padding:22px}
            .order-heading{display:block}
            .status-pill{margin-top:14px}
          }
        `}</style>

        <div className="track-shell">
          <section className="track-hero">
            <p className="eyebrow">ORDER SUPPORT</p>
            <h1>Track or manage your order</h1>
            <p>Enter the order number from your confirmation email to see your order details.</p>
          </section>

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
              <label className="lookup-field">
                Order number
                <input
                  name="orderId"
                  autoComplete="off"
                  placeholder="e.g. KB-20260721-ABC123"
                  value={orderNumber}
                  onChange={(event) => setOrderNumber(event.target.value)}
                  required
                />
              </label>
              <button className="lookup-btn" type="submit" disabled={loading}>
                {loading ? 'Searching…' : 'Find my order'}
              </button>
              <p className="form-message" role="status" aria-live="polite">{message}</p>
            </form>
          </section>

          {order && (
            <section className="order-panel" ref={panelRef} aria-live="polite">
              <div className="order-heading">
                <div>
                  <p className="eyebrow">YOUR ORDER</p>
                  <h2>{order.orderNumber}</h2>
                  <p className="muted">Placed {formatDate(order.placedAt)}</p>
                </div>
                <span className="status-pill">{order.demo ? 'Demo order' : 'Order received'}</span>
              </div>

              <div className="panel-grid">
                <article className="panel-card timeline-card">
                  <h3>Order progress</h3>
                  <ol className="timeline">
                    <li className="current">
                      Order received
                      <small>{formatDate(order.placedAt)}</small>
                    </li>
                    <li>Packed and ready</li>
                    <li>Dispatched with NZ Post</li>
                  </ol>
                </article>

                <article className="panel-card">
                  <h3>Order summary</h3>
                  <div className="order-items">
                    <div className="order-item">
                      <div>
                        <p>{order.product.name || 'Kimberry product'}</p>
                        {order.product.detail && <small>{order.product.detail}</small>}
                        <small>Quantity {order.product.qty || 1}</small>
                      </div>
                      <strong>{money(subtotal)}</strong>
                    </div>
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

                <article className="panel-card delivery-card">
                  <h3>Delivery details</h3>
                  <p>{customerName || 'Kimberry customer'}</p>
                  {addressLine && <p className="muted">{addressLine}</p>}
                  {order.customer.email && <p className="muted">{order.customer.email}</p>}
                </article>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
