'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';

/* ------------------------------------------------------------------ */
/*  Product data — mirrors KB_PRODUCTS from the reference shop.js      */
/* ------------------------------------------------------------------ */
interface Product {
  id: string;
  category: string;
  name: string;
  size: string;
  originalPrice: number;
  price: number;
  weightGrams: number;
  freeShipping?: boolean;
  image: string;
  desc: string;
}

const PRODUCTS: Product[] = [
  { id: 'oat-unsweetened', category: 'Milk Oat Flakes', name: 'Unsweetened', size: '400g · 10 sachets', originalPrice: 24.90, price: 19.90, weightGrams: 400, freeShipping: true, image: '/products/unsweetened_milk_oats.png', desc: 'A clean oat and milk base for a naturally simple everyday breakfast.' },
  { id: 'oat-classic', category: 'Milk Oat Flakes', name: 'Classic', size: '400g · 10 sachets', originalPrice: 24.90, price: 19.90, weightGrams: 400, image: '/products/classic_milk_oatmeal_front.png', desc: 'Lightly sweetened with creamy New Zealand milk and natural oat texture.' },
  { id: 'oat-coconut', category: 'Milk Oat Flakes', name: 'Coconut', size: '400g · 10 sachets', originalPrice: 26.90, price: 21.90, weightGrams: 400, image: '/products/unsweetened_milk_oats.png', desc: 'Creamy oats with a gentle coconut finish for a softer tropical profile.' },
  { id: 'bean-dark', category: 'Milk Beans', name: 'Dark Chocolate Chips', size: '150g', originalPrice: 18.90, price: 15.90, weightGrams: 150, image: '/products/milk_beans_front.png', desc: 'Creamy milk bites balanced with crisp dark chocolate pieces.' },
  { id: 'bean-coconut', category: 'Milk Beans', name: 'Coconut', size: '150g', originalPrice: 18.90, price: 15.90, weightGrams: 150, image: '/products/milk_beans_front.png', desc: 'Smooth dairy flavour with gentle coconut notes for everyday snacking.' },
  { id: 'quick-oats', category: 'Quick Oats', name: 'Original', size: '800g', originalPrice: 15.90, price: 12.90, weightGrams: 800, freeShipping: true, image: '/products/oats_front.png', desc: '100% wholegrain oats for porridge, overnight oats, smoothies and baking.' },
];

const CATEGORIES = ['All products', 'Milk Oat Flakes', 'Milk Beans', 'Quick Oats'] as const;

const CART_KEY = 'kimberry_cart_v3';

interface CartLine { id: string; qty: number; }

const money = (n: number) => new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(Number(n || 0));

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All products');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  // per-product quantity inputs (keyed by product id)
  const [qtyInputs, setQtyInputs] = useState<Record<string, number>>({});
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // checkout modal (Buy now / Continue to checkout)
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartLine[]>([]);
  const [checkoutSource, setCheckoutSource] = useState<'buy-now' | 'basket'>('buy-now');
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    address: '', city: '', region: '', postcode: '', phone: '',
    marketingConsent: false, terms: false,
  });

  /* ---- hydrate cart from localStorage ---- */
  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      if (Array.isArray(stored)) setCart(stored);
    } catch { /* noop */ }
  }, []);

  /* ---- persist cart ---- */
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, mounted]);

  /* ---- toast auto-hide ---- */
  useEffect(() => {
    if (toast) {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    }
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, [toast]);

  /* ---- lock body scroll when drawer or checkout open ---- */
  useEffect(() => {
    document.body.style.overflow = drawerOpen || checkoutOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, checkoutOpen]);

  /* ---- helpers ---- */
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartSubtotal = cart
    .map(l => ({ ...PRODUCTS.find(p => p.id === l.id)!, qty: l.qty }))
    .filter(x => x.id)
    .reduce((s, x) => s + x.price * x.qty, 0);

  const showToast = (msg: string) => setToast(msg);

  const addToCart = (id: string, qty: number) => {
    setCart(prev => {
      const line = prev.find(x => x.id === id);
      if (line) return prev.map(x => x.id === id ? { ...x, qty: x.qty + qty } : x);
      return [...prev, { id, qty }];
    });
    showToast('Added to your Kimberry basket');
  };

  const buyNow = (id: string, qty: number) => {
    // open the information form with just this item (mirrors checkout.html?mode=buy-now)
    setCheckoutItems([{ id, qty: Math.max(1, qty) }]);
    setCheckoutSource('buy-now');
    setOrderPlaced(null);
    setCheckoutOpen(true);
  };

  const openCheckoutFromBasket = () => {
    if (cart.length === 0) return;
    setCheckoutItems(cart);
    setCheckoutSource('basket');
    setOrderPlaced(null);
    setCheckoutOpen(true);
    setDrawerOpen(false);
  };

  const updateForm = (key: keyof typeof form, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const resetForm = () => setForm({
    email: '', firstName: '', lastName: '',
    address: '', city: '', region: '', postcode: '', phone: '',
    marketingConsent: false, terms: false,
  });

  const closeCheckout = () => {
    setCheckoutOpen(false);
    setOrderPlaced(null);
    resetForm();
  };

  const submitCheckout = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderId = 'KB-' + Date.now().toString(36).toUpperCase().slice(-6) + '-' +
      Math.random().toString(36).toUpperCase().slice(2, 5);
    setOrderPlaced(orderId);
    if (checkoutSource === 'basket') setCart([]);
    showToast('Order placed — check your email for confirmation.');
  };

  const changeQty = (id: string, delta: number) => {
    setCart(prev => prev
      .map(x => x.id === id ? { ...x, qty: x.qty + delta } : x)
      .filter(x => x.qty > 0));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(x => x.id !== id));
  };

  const getQty = (id: string) => qtyInputs[id] ?? 1;
  const setQty = (id: string, val: number) => setQtyInputs(prev => ({ ...prev, [id]: Math.max(1, val) }));

  const filteredProducts = activeCategory === 'All products'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  const cartDetails = cart
    .map(l => ({ ...PRODUCTS.find(p => p.id === l.id)!, qty: l.qty }))
    .filter(x => x.id);

  /* ---- checkout (Buy now / basket) derived data ---- */
  const checkoutDetails = checkoutItems
    .map(l => ({ ...PRODUCTS.find(p => p.id === l.id)!, qty: l.qty }))
    .filter(x => x.id);
  const checkoutSubtotal = checkoutDetails.reduce((s, x) => s + x.price * x.qty, 0);
  const checkoutAllFreeShipping = checkoutDetails.length > 0 && checkoutDetails.every(x => x.freeShipping);

  /* ---- escape closes checkout, then drawer ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (checkoutOpen) {
        setCheckoutOpen(false);
        setOrderPlaced(null);
        resetForm();
      } else if (drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [checkoutOpen, drawerOpen]);

  return (
    <>
      {/* fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        :root{
          --ink:#0E1C2E;--muted:#68788E;--forest:#1C3A5E;--forest-mid:#2A5282;
          --oat:#C8A96E;--oat-soft:#F5EBD8;--cream:#FBFAF6;--blue-soft:#F2F7FC;
          --line:rgba(28,58,94,.10);--white:#fff;
          --shadow:0 24px 70px rgba(28,58,94,.10);
          --green:#38715b;--red:#b6453f;--sale:#b13f38;
        }
        *{box-sizing:border-box}
        .kb-shop{font-family:'Outfit',sans-serif;color:var(--ink);background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased}
        .kb-shop a{text-decoration:none;color:inherit}

        /* hero */
        .kb-shop .hero{padding:120px 6vw 62px;background:linear-gradient(135deg,#F6F9FC,#F7F2E8);position:relative;overflow:hidden}
        .kb-shop .hero:after{content:'';position:absolute;width:420px;height:420px;border-radius:50%;right:-110px;top:-180px;background:rgba(200,169,110,.18)}
        .kb-shop .eyebrow{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--forest);font-weight:600}
        .kb-shop .hero h1{font-family:'Cormorant Garamond',serif;font-size:clamp(46px,5vw,68px);font-weight:400;line-height:.95;letter-spacing:-.04em;max-width:720px;margin:15px 0 12px}
        .kb-shop .hero h1 em{color:var(--oat);font-weight:300;font-style:italic}
        .kb-shop .hero p{max-width:650px;color:var(--muted);font-size:17px}
        .kb-shop .trust-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
        .kb-shop .trust-pill{padding:9px 13px;border:1px solid rgba(28,58,94,.13);border-radius:999px;font-size:13px;color:var(--forest);font-weight:500}

        /* support bar */
        .kb-shop .shop-support-bar{min-height:52px;padding:10px 6vw;display:flex;align-items:center;justify-content:flex-end;gap:12px;border-bottom:1px solid var(--line);background:#fff;color:var(--muted);font-size:13px}
        .kb-shop .shop-support-bar a{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border-radius:999px;background:var(--blue-soft);color:var(--forest);font-weight:600;transition:background .2s}
        .kb-shop .shop-support-bar a:hover{background:#E1EBF7}
        .kb-shop .shop-support-bar b{transition:transform .2s}
        .kb-shop .shop-support-bar a:hover b{transform:translateX(3px)}

        /* main */
        .kb-shop .shop-wrap{padding:48px 6vw 24px;max-width:1280px;margin:0 auto}
        .kb-shop .section-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:28px;flex-wrap:wrap}
        .kb-shop .section-head h2{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,3.4vw,48px);font-weight:400;letter-spacing:-.04em;margin:0}
        .kb-shop .section-head p{color:var(--muted);font-size:15px;margin:0;max-width:400px;text-align:right}

        /* category tabs */
        .kb-shop .category-tabs{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:36px}
        .kb-shop .cat-tab{height:52px;padding:0 24px;border-radius:999px;border:1px solid rgba(28,58,94,.10);background:rgba(255,255,255,.72);color:var(--forest);cursor:pointer;font-size:14px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;transition:background .2s,color .2s,transform .2s,box-shadow .2s}
        .kb-shop .cat-tab:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(28,58,94,.07)}
        .kb-shop .cat-tab.active{background:var(--forest);color:#fff;box-shadow:0 16px 36px rgba(28,58,94,.14)}

        /* products grid */
        .kb-shop .products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:28px}
        .kb-shop .product-card{border-radius:28px;overflow:hidden;background:#fff;border:1px solid rgba(28,58,94,.06);box-shadow:0 18px 50px rgba(28,58,94,.055);transition:transform .28s ease,box-shadow .28s ease}
        .kb-shop .product-card:hover{transform:translateY(-6px);box-shadow:0 28px 70px rgba(28,58,94,.10)}

        .kb-shop .product-visual{height:260px;background:#f3f5f6;position:relative;display:grid;place-items:center;overflow:hidden}
        .kb-shop .product-visual img{width:100%;height:100%;object-fit:cover;display:block}
        .kb-shop .free-shipping-badge{position:absolute;right:16px;top:16px;z-index:2;padding:7px 11px;border-radius:999px;background:var(--green);color:#fff;font-size:11px;font-weight:700;letter-spacing:.03em;box-shadow:0 6px 18px rgba(35,93,69,.18)}
        .kb-shop .discount-badge{position:absolute;left:16px;top:16px;z-index:2;padding:7px 11px;border-radius:999px;background:var(--red);color:#fff;font-size:11px;font-weight:700;letter-spacing:.06em;box-shadow:0 6px 18px rgba(111,36,31,.2)}

        .kb-shop .product-info{padding:22px 22px 24px}
        .kb-shop .product-kicker{display:block;font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:6px}
        .kb-shop .product-info h3{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:500;line-height:1;margin:0 0 8px;color:var(--ink);letter-spacing:-.02em}
        .kb-shop .product-info>p{color:var(--muted);font-size:13px;line-height:1.55;margin:0 0 16px}

        .kb-shop .product-meta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;flex-wrap:wrap}
        .kb-shop .product-pricing{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap}
        .kb-shop .original-price{color:#8a949d;font-size:14px;text-decoration:line-through;text-decoration-thickness:1px}
        .kb-shop .price{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:500;color:var(--forest)}
        .kb-shop .sale-price{color:var(--sale)!important}
        .kb-shop .stock{font-size:12px;color:var(--green);font-weight:600}

        .kb-shop .product-actions{display:grid;grid-template-columns:82px minmax(0,1fr) minmax(0,1.35fr);gap:10px;align-items:center}
        .kb-shop .qty{display:flex;align-items:center;border:1px solid rgba(28,58,94,.14);border-radius:12px;overflow:hidden;height:48px}
        .kb-shop .qty button{border:0;background:#fff;width:32px;height:100%;cursor:pointer;color:var(--forest);font-size:18px;font-weight:700}
        .kb-shop .qty button:hover{background:var(--blue-soft)}
        .kb-shop .qty input{width:100%;border:0;text-align:center;font-size:14px;font-weight:600;color:var(--ink);outline:none;background:transparent;padding:0}
        .kb-shop .buy-now-btn{border:1px solid var(--forest);border-radius:12px;background:#fff;color:var(--forest);padding:0 12px;height:48px;cursor:pointer;font-weight:600;font-size:13px;transition:background .2s}
        .kb-shop .buy-now-btn:hover{background:var(--blue-soft)}
        .kb-shop .add-btn{border:0;border-radius:12px;background:var(--forest);color:#fff;padding:0 12px;height:48px;cursor:pointer;font-weight:600;font-size:13px;transition:background .2s}
        .kb-shop .add-btn:hover{background:var(--forest-mid)}

        /* shipping note */
        .kb-shop .shipping-note{margin-top:44px;padding:24px 28px;border-radius:20px;background:var(--blue-soft);border:1px solid rgba(28,58,94,.06);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
        .kb-shop .shipping-note strong{display:block;font-size:15px;color:var(--forest);margin-bottom:4px}
        .kb-shop .shipping-note span{color:var(--muted);font-size:13px}

        /* cart drawer */
        .kb-shop .overlay{position:fixed;inset:0;background:rgba(14,28,46,.45);z-index:110;opacity:0;pointer-events:none;transition:opacity .3s}
        .kb-shop .overlay.open{opacity:1;pointer-events:auto}
        .kb-shop .cart-drawer{position:fixed;top:0;right:0;bottom:0;width:min(420px,100vw);background:#fff;z-index:120;transform:translateX(100%);transition:transform .35s cubic-bezier(.32,.72,0,1);display:flex;flex-direction:column;box-shadow:-24px 0 70px rgba(14,28,46,.14)}
        .kb-shop .cart-drawer.open{transform:translateX(0)}
        .kb-shop .drawer-head{display:flex;align-items:center;justify-content:space-between;padding:24px 24px 18px;border-bottom:1px solid var(--line)}
        .kb-shop .drawer-head h2{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;margin:0;color:var(--forest)}
        .kb-shop .icon-btn{border:0;background:none;font-size:28px;cursor:pointer;color:var(--muted);line-height:1;padding:4px}
        .kb-shop .icon-btn:hover{color:var(--ink)}
        .kb-shop .cart-items{flex:1;overflow-y:auto;padding:8px 24px}
        .kb-shop .cart-item{display:grid;grid-template-columns:1fr auto;gap:12px;padding:16px 0;border-bottom:1px solid var(--line)}
        .kb-shop .cart-item h4{margin:0 0 4px;font-size:15px;font-weight:600;color:var(--ink)}
        .kb-shop .cart-item small{color:var(--muted);font-size:12px}
        .kb-shop .cart-item b{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;color:var(--forest)}
        .kb-shop .cart-item-actions{display:flex;align-items:center;gap:12px;margin-top:10px}
        .kb-shop .mini-qty{display:flex;align-items:center;border:1px solid rgba(28,58,94,.14);border-radius:8px;overflow:hidden}
        .kb-shop .mini-qty button{border:0;background:#fff;width:28px;height:30px;cursor:pointer;color:var(--forest);font-size:16px;font-weight:700}
        .kb-shop .mini-qty button:hover{background:var(--blue-soft)}
        .kb-shop .mini-qty span{padding:0 8px;font-size:13px;font-weight:600}
        .kb-shop .cart-item .remove{border:0;background:none;color:var(--muted);font-size:12px;cursor:pointer;text-decoration:underline}
        .kb-shop .cart-item .remove:hover{color:var(--red)}
        .kb-shop .cart-empty{text-align:center;padding:60px 24px}
        .kb-shop .cart-empty h3{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:400;color:var(--muted);margin:0 0 8px}
        .kb-shop .cart-empty p{color:var(--muted);font-size:14px;margin:0}

        .kb-shop .drawer-foot{padding:20px 24px 28px;border-top:1px solid var(--line)}
        .kb-shop .total-line{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
        .kb-shop .total-line span{font-size:14px;color:var(--muted)}
        .kb-shop .total-line strong{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--forest)}
        .kb-shop .drawer-foot p{font-size:11px;color:var(--muted);margin:0 0 16px;line-height:1.45}
        .kb-shop .primary-btn{width:100%;border:0;border-radius:12px;background:var(--forest);color:#fff;padding:15px;cursor:pointer;font-size:14px;font-weight:700;letter-spacing:.04em;transition:background .2s}
        .kb-shop .primary-btn:hover{background:var(--forest-mid)}
        .kb-shop .primary-btn:disabled{opacity:.5;cursor:not-allowed}

        /* toast */
        .kb-shop .toast{position:fixed;left:50%;bottom:28px;transform:translate(-50%,20px);background:var(--forest);color:#fff;padding:12px 18px;border-radius:999px;z-index:200;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s;font-size:14px;font-weight:500}
        .kb-shop .toast.show{opacity:1;transform:translate(-50%,0)}

        /* checkout modal */
        .kb-shop .checkout-overlay{position:fixed;inset:0;background:rgba(14,28,46,.5);z-index:130;opacity:0;pointer-events:none;transition:opacity .3s;backdrop-filter:blur(2px)}
        .kb-shop .checkout-overlay.open{opacity:1;pointer-events:auto}
        .kb-shop .checkout-modal{position:fixed;inset:0;z-index:140;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;overflow-y:auto;pointer-events:none}
        .kb-shop .checkout-modal.open{pointer-events:auto}
        .kb-shop .checkout-card{background:#fff;border-radius:24px;width:100%;max-width:920px;box-shadow:0 30px 90px rgba(14,28,46,.22);transform:translateY(16px) scale(.98);opacity:0;transition:transform .35s cubic-bezier(.32,.72,0,1),opacity .35s;overflow:hidden}
        .kb-shop .checkout-modal.open .checkout-card{transform:translateY(0) scale(1);opacity:1}
        .kb-shop .checkout-head{display:flex;align-items:center;justify-content:space-between;padding:24px 28px;border-bottom:1px solid var(--line)}
        .kb-shop .checkout-head h2{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:500;margin:0;color:var(--forest);letter-spacing:-.02em}
        .kb-shop .checkout-head .secure-tag{font-size:12px;color:var(--muted);font-weight:600;letter-spacing:.04em}
        .kb-shop .checkout-body{display:grid;grid-template-columns:1fr 320px;gap:0}
        .kb-shop .checkout-form{padding:28px}
        .kb-shop .checkout-aside{background:var(--blue-soft);padding:28px;border-left:1px solid var(--line)}
        .kb-shop .checkout-aside h3{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;margin:0 0 16px;color:var(--forest)}
        .kb-shop .step-card{margin-bottom:24px}
        .kb-shop .step-card:last-child{margin-bottom:0}
        .kb-shop .step-head{display:flex;align-items:center;gap:12px;margin-bottom:16px}
        .kb-shop .step-no{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--forest);color:#fff;font-size:13px;font-weight:700;flex-shrink:0}
        .kb-shop .step-head h3{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;margin:0;color:var(--ink)}
        .kb-shop .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .kb-shop .field{display:flex;flex-direction:column;gap:6px}
        .kb-shop .field.full{grid-column:1/-1}
        .kb-shop .field>label{font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.02em}
        .kb-shop .field input{height:46px;border:1px solid rgba(28,58,94,.16);border-radius:10px;padding:0 14px;font-size:14px;font-family:inherit;color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s;background:#fff}
        .kb-shop .field input:focus{border-color:var(--oat);box-shadow:0 0 0 3px rgba(200,169,110,.14)}
        .kb-shop .marketing-consent{display:flex;align-items:flex-start;gap:8px;margin-top:8px;font-size:12px;color:var(--muted);font-weight:400;line-height:1.5}
        .kb-shop .marketing-consent input{width:auto;height:auto;margin-top:2px}
        .kb-shop .method-card{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid rgba(28,58,94,.12);border-radius:14px;background:#fff}
        .kb-shop .method-card .method-icon{display:grid;place-items:center;width:40px;height:40px;border-radius:10px;background:var(--forest);color:#fff;font-weight:700;font-size:13px;flex-shrink:0}
        .kb-shop .method-card b{display:block;font-size:14px;color:var(--ink)}
        .kb-shop .method-card small{display:block;font-size:12px;color:var(--muted)}
        .kb-shop .method-card .method-price{margin-left:auto;font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;color:var(--forest)}
        .kb-shop .pay-note{padding:16px;border:1px dashed rgba(28,58,94,.18);border-radius:14px;background:var(--oat-soft);font-size:13px;color:var(--forest);line-height:1.5}
        .kb-shop .summary-list{margin-bottom:18px}
        .kb-shop .summary-line-item{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid rgba(28,58,94,.08)}
        .kb-shop .summary-line-item:last-child{border-bottom:0}
        .kb-shop .summary-line-item .nm{font-size:13px;color:var(--ink);font-weight:600}
        .kb-shop .summary-line-item .meta{font-size:11px;color:var(--muted)}
        .kb-shop .summary-line-item b{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:var(--forest);white-space:nowrap}
        .kb-shop .summary-totals{margin:14px 0 16px}
        .kb-shop .summary-totals .row{display:flex;justify-content:space-between;font-size:13px;color:var(--muted);padding:4px 0}
        .kb-shop .summary-totals .row.grand{font-size:16px;color:var(--ink);font-weight:700;border-top:1px solid var(--line);margin-top:6px;padding-top:10px}
        .kb-shop .summary-totals .row.grand b{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:500;color:var(--forest)}
        .kb-shop .terms{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--muted);margin:0 0 14px;line-height:1.5}
        .kb-shop .terms input{width:auto;height:auto;margin-top:2px}
        .kb-shop .place-order{width:100%;border:0;border-radius:12px;background:var(--forest);color:#fff;padding:15px;cursor:pointer;font-size:14px;font-weight:700;letter-spacing:.04em;transition:background .2s}
        .kb-shop .place-order:hover{background:var(--forest-mid)}
        .kb-shop .secure-note{font-size:11px;color:var(--muted);text-align:center;margin-top:12px;line-height:1.5}
        .kb-shop .success-state{text-align:center;padding:48px 28px}
        .kb-shop .success-state .check{display:grid;place-items:center;width:72px;height:72px;border-radius:50%;background:var(--green);color:#fff;font-size:36px;margin:0 auto 20px;box-shadow:0 12px 30px rgba(35,93,69,.25)}
        .kb-shop .success-state h3{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:500;margin:0 0 8px;color:var(--forest)}
        .kb-shop .success-state p{color:var(--muted);font-size:14px;margin:0 0 6px}
        .kb-shop .success-state .order-id{display:inline-block;margin-top:14px;padding:8px 16px;border-radius:999px;background:var(--oat-soft);color:var(--forest);font-weight:700;font-size:14px;letter-spacing:.04em}
        .kb-shop .success-actions{display:flex;gap:12px;justify-content:center;margin-top:24px}
        .kb-shop .ghost-btn{border:1px solid var(--forest);border-radius:12px;background:#fff;color:var(--forest);padding:12px 22px;cursor:pointer;font-weight:600;font-size:13px;transition:background .2s}
        .kb-shop .ghost-btn:hover{background:var(--blue-soft)}

        /* responsive */
        @media(max-width:900px){
          .kb-shop .products-grid{grid-template-columns:1fr 1fr}
          .kb-shop .section-head{flex-direction:column;align-items:flex-start}
          .kb-shop .section-head p{text-align:left}
        }
        @media(max-width:620px){
          .kb-shop .hero{padding:100px 20px 40px}
          .kb-shop .hero h1{font-size:44px}
          .kb-shop .shop-wrap{padding:36px 20px 24px}
          .kb-shop .products-grid{grid-template-columns:1fr}
          .kb-shop .product-actions{grid-template-columns:82px 1fr}
          .kb-shop .add-btn{grid-column:1/-1}
          .kb-shop .shipping-note{display:block}
          .kb-shop .shop-support-bar{justify-content:center;padding-left:20px;padding-right:20px}
        }
        @media(max-width:760px){
          .kb-shop .checkout-modal{padding:0}
          .kb-shop .checkout-card{border-radius:0;min-height:100vh}
          .kb-shop .checkout-body{grid-template-columns:1fr}
          .kb-shop .checkout-aside{border-left:0;border-top:1px solid var(--line)}
          .kb-shop .form-grid{grid-template-columns:1fr}
          .kb-shop .checkout-form{padding:22px}
          .kb-shop .checkout-aside{padding:22px}
        }
      `}</style>

      <div className="kb-shop">
        {/* ---- Hero ---- */}
        <header className="hero">
          <span className="eyebrow">Kimberry online shop · New Zealand</span>
          <h1>Simple food, made for <em>everyday life.</em></h1>
          <p>Shop our New Zealand-made oat and milk favourites. Clean ingredients, calm flavours and straightforward local delivery.</p>
          <div className="trust-row">
            <span className="trust-pill">0 additives</span>
            <span className="trust-pill">0 preservatives</span>
            <span className="trust-pill">0 artificial colours</span>
          </div>
        </header>

        {/* ---- Support bar ---- */}
        <div className="shop-support-bar">
          <span>Already placed an order?</span>
          <a href="/order-query">Track your order <b>→</b></a>
        </div>

        {/* ---- Products ---- */}
        <main className="shop-wrap">
          <div className="section-head">
            <h2>Choose your favourites</h2>
            <p>Thoughtfully made pantry staples and snacks, delivered across New Zealand.</p>
          </div>

          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <section className="products-grid">
            {filteredProducts.map(p => (
              <article key={p.id} className="product-card">
                <div className="product-visual">
                  <img src={p.image} alt={`${p.name} product image`} />
                  {p.freeShipping && <span className="free-shipping-badge">Free shipping</span>}
                  {p.originalPrice > p.price && <span className="discount-badge">Sale</span>}
                </div>
                <div className="product-info">
                  <span className="product-kicker">{p.category} · {p.size}</span>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="product-meta">
                    <div className="product-pricing">
                      <span className="original-price">{money(p.originalPrice)}</span>
                      <span className={`price ${p.originalPrice > p.price ? 'sale-price' : ''}`}>{money(p.price)}</span>
                    </div>
                    <span className="stock">● In stock</span>
                  </div>
                  <div className="product-actions">
                    <div className="qty">
                      <button onClick={() => setQty(p.id, getQty(p.id) - 1)} aria-label="Decrease quantity">−</button>
                      <input
                        value={getQty(p.id)}
                        inputMode="numeric"
                        aria-label="Quantity"
                        onChange={e => {
                          const v = parseInt(e.target.value.replace(/\D/g, '')) || 1;
                          setQty(p.id, v);
                        }}
                      />
                      <button onClick={() => setQty(p.id, getQty(p.id) + 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button className="buy-now-btn" onClick={() => buyNow(p.id, getQty(p.id))}>Buy now</button>
                    <button className="add-btn" onClick={() => addToCart(p.id, getQty(p.id))}>Add to basket</button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <div className="shipping-note">
            <div>
              <strong>Product-specific delivery</strong>
              <br />
              <span>Products marked “Free shipping” are delivered free. Other products are charged at the NZ Post rate.</span>
            </div>
            <span className="trust-pill">Secure checkout · NZD</span>
          </div>
        </main>

        {/* ---- Cart drawer ---- */}
        <div className={`overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
        <aside className={`cart-drawer ${drawerOpen ? 'open' : ''}`}>
          <div className="drawer-head">
            <h2>Your basket</h2>
            <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close basket">×</button>
          </div>
          <div className="cart-items">
            {cartDetails.length === 0 ? (
              <div className="cart-empty">
                <h3>Your basket is empty</h3>
                <p>Choose a Kimberry favourite to begin.</p>
              </div>
            ) : (
              cartDetails.map(x => (
                <div key={x.id} className="cart-item">
                  <div>
                    <h4>{x.name}</h4>
                    <small>{x.category} · {x.size}</small>
                    <div className="cart-item-actions">
                      <div className="mini-qty">
                        <button onClick={() => changeQty(x.id, -1)} aria-label="Decrease">−</button>
                        <span>{x.qty}</span>
                        <button onClick={() => changeQty(x.id, 1)} aria-label="Increase">+</button>
                      </div>
                      <button className="remove" onClick={() => removeItem(x.id)}>Remove</button>
                    </div>
                  </div>
                  <b>{money(x.price * x.qty)}</b>
                </div>
              ))
            )}
          </div>
          <div className="drawer-foot">
            <div className="total-line">
              <span>Subtotal</span>
              <strong>{money(cartSubtotal)}</strong>
            </div>
            <p>Shipping is calculated at checkout. Products marked “Free shipping” are delivered free.</p>
            <button
              className="primary-btn"
              disabled={cartDetails.length === 0}
              onClick={openCheckoutFromBasket}
            >
              Continue to checkout
            </button>
          </div>
        </aside>

        {/* ---- Checkout modal (Buy now / Continue to checkout) ---- */}
        <div className={`checkout-overlay ${checkoutOpen ? 'open' : ''}`} onClick={closeCheckout} />
        <div
          className={`checkout-modal ${checkoutOpen ? 'open' : ''}`}
          onClick={e => { if (e.target === e.currentTarget) closeCheckout(); }}
        >
          <div className="checkout-card" role="dialog" aria-modal="true" aria-label="Checkout">
            {orderPlaced ? (
              <div className="success-state">
                <div className="check">✓</div>
                <h3>Thank you. Your order is confirmed.</h3>
                <p>A confirmation has been sent to {form.email || 'your email'}.</p>
                <p>We’ll email your NZ Post tracking details after dispatch.</p>
                <span className="order-id">Order {orderPlaced}</span>
                <div className="success-actions">
                  <button className="ghost-btn" onClick={closeCheckout}>Continue shopping</button>
                </div>
              </div>
            ) : (
              <>
                <div className="checkout-head">
                  <h2>Complete your order</h2>
                  <span className="secure-tag">🔒 Secure checkout · NZD</span>
                </div>
                <div className="checkout-body">
                  <form className="checkout-form" onSubmit={submitCheckout}>
                    <div className="step-card">
                      <div className="step-head"><span className="step-no">1</span><h3>Contact &amp; delivery</h3></div>
                      <div className="form-grid">
                        <div className="field full">
                          <label>Email address</label>
                          <input type="email" required value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="you@example.com" autoComplete="email" />
                          <label className="marketing-consent">
                            <input type="checkbox" checked={form.marketingConsent} onChange={e => updateForm('marketingConsent', e.target.checked)} />
                            <span>Email me Kimberry news, product updates and occasional offers. You can unsubscribe at any time.</span>
                          </label>
                        </div>
                        <div className="field">
                          <label>First name</label>
                          <input required value={form.firstName} onChange={e => updateForm('firstName', e.target.value)} autoComplete="given-name" />
                        </div>
                        <div className="field">
                          <label>Last name</label>
                          <input required value={form.lastName} onChange={e => updateForm('lastName', e.target.value)} autoComplete="family-name" />
                        </div>
                        <div className="field full">
                          <label>Street address</label>
                          <input required value={form.address} onChange={e => updateForm('address', e.target.value)} placeholder="Your NZ delivery address" autoComplete="street-address" />
                        </div>
                        <div className="field">
                          <label>City</label>
                          <input required value={form.city} onChange={e => updateForm('city', e.target.value)} autoComplete="address-level2" />
                        </div>
                        <div className="field">
                          <label>Region</label>
                          <input required value={form.region} onChange={e => updateForm('region', e.target.value)} autoComplete="address-level1" />
                        </div>
                        <div className="field">
                          <label>Postcode</label>
                          <input required value={form.postcode} onChange={e => updateForm('postcode', e.target.value)} autoComplete="postal-code" />
                        </div>
                        <div className="field">
                          <label>Phone</label>
                          <input type="tel" required value={form.phone} onChange={e => updateForm('phone', e.target.value)} autoComplete="tel" />
                        </div>
                      </div>
                    </div>

                    <div className="step-card">
                      <div className="step-head"><span className="step-no">2</span><h3>Delivery method</h3></div>
                      <div className="method-card">
                        <span className="method-icon">NZ</span>
                        <span>
                          <b>NZ Post delivery</b>
                          <small>{checkoutAllFreeShipping ? 'Includes free-shipping product(s) — delivered free.' : 'Delivery calculated at the next step.'}</small>
                        </span>
                        <span className="method-price">{checkoutAllFreeShipping ? 'FREE' : '—'}</span>
                      </div>
                    </div>

                    <div className="step-card">
                      <div className="step-head"><span className="step-no">3</span><h3>Payment</h3></div>
                      <div className="pay-note">🔒 Payment is collected securely at the next step. No card details are stored by Kimberry.</div>
                    </div>

                    <label className="terms">
                      <input type="checkbox" required checked={form.terms} onChange={e => updateForm('terms', e.target.checked)} />
                      <span>I agree to Kimberry’s terms, privacy policy and delivery conditions.</span>
                    </label>
                    <button className="place-order" type="submit">Place order · {money(checkoutSubtotal)}</button>
                    <p className="secure-note">Demo checkout — no real payment will be processed.</p>
                  </form>

                  <aside className="checkout-aside">
                    <h3>Order summary</h3>
                    <div className="summary-list">
                      {checkoutDetails.map(x => (
                        <div key={x.id} className="summary-line-item">
                          <div>
                            <div className="nm">{x.name}</div>
                            <div className="meta">{x.size} × {x.qty}</div>
                          </div>
                          <b>{money(x.price * x.qty)}</b>
                        </div>
                      ))}
                    </div>
                    <div className="summary-totals">
                      <div className="row"><span>Subtotal</span><span>{money(checkoutSubtotal)}</span></div>
                      <div className="row"><span>Delivery</span><span>{checkoutAllFreeShipping ? 'FREE' : 'Calculated at checkout'}</span></div>
                      <div className="row grand"><span>Total</span><b>{money(checkoutSubtotal)}</b></div>
                    </div>
                  </aside>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ---- Toast ---- */}
        <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
      </div>
    </>
  );
}
