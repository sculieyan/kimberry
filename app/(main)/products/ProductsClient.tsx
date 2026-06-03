"use client"; // 必须第一行

import Link from 'next/link'
import { HeroSection } from '@/components/layout/Utils'
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Product {
  title: string;
  name: string;
  desc: string;
  image: string;
  bg: string;
  pack: string;
}

interface CategoryData {
  title: string;
  desc: string;
  proof: [string, string][];
  products: Product[];
}

const data: Record<string, CategoryData> = {
  oatmeal: {
    title: "A creamy everyday meal from <em>oats and milk</em>.",
    desc: "Made with New Zealand rolled oats and instant whole milk powder, Kimberry Milk Oatmeal brings together natural grain aroma and dairy richness. It is designed for breakfast, school mornings, work breaks and simple daily nutrition.",
    proof: [["400g","10 sachets × 40g"],["2","Flavours"],["0","Additives · Preservatives · Colours"]],
    products: [
      {title:"Milk\\A Oatmeal", name:"Unsweetened", desc:"A simple oat and milk base for customers who prefer a cleaner, less sweet daily breakfast.", image:"/products/unsweetened_milk_oats.png", bg:"linear-gradient(135deg,#EAF3FC,#D9E8F6)", pack:"linear-gradient(180deg,#FFFFFF 0%,#EAF3FC 48%,#1C3A5E 100%)"},
      {title:"Milk\\A Oatmeal", name:"Classic", desc:"A lightly sweetened profile with creamy milk aroma and natural oat texture.", image:"/products/classic_milk_oatmeal_front.png", bg:"linear-gradient(135deg,#F7F2E8,#EAD9B8)", pack:"linear-gradient(180deg,#FFF9EB 0%,#F3E6CF 48%,#C8A96E 100%)"},
      // {title:"Milk\\A Oatmeal", name:"Coconut", desc:"Creamy oats with a gentle coconut finish, bringing a softer tropical flavour to everyday breakfasts and light meals.", image:"/products/new_milk_oatmeal_green.png", bg:"linear-gradient(135deg,#F4F8F3,#DDEBDD)", pack:"linear-gradient(180deg,#FFFFFF 0%,#E9F2E7 48%,#6F9477 100%)"}
    ]
  },
  tablets: {
    title: "An everyday milk snack with <em>real dairy</em>.",
    desc: "Built on a New Zealand milk base, then layered with chocolate pieces, coconut notes and other flavour combinations — creating a snack that feels more satisfying, more balanced and easier to enjoy every day.",
    proof: [["15g","Each pack"],["1","Flavours"],["0","Additives · Preservatives · Colours"]],
    products: [
      {title:"Milk\\A Tablets", name:"Dark Chocolate Chips", desc:"A creamy milk-based snack balanced with crisp dark chocolate pieces, creating a richer cocoa finish while still keeping a smooth dairy texture.", image:"/products/milk_beans_front.png", bg:"linear-gradient(135deg,#F7F2E8,#E3C9A8)", pack:"linear-gradient(180deg,#FFF7E8 0%,#EFDABD 48%,#8A6338 100%)"},
      // {title:"Milk\\A Tablets", name:"Coconut", desc:"Soft milk flavour with gentle coconut notes, bringing a lighter and more relaxed tropical profile for everyday snacking.", image:"/products/milk_tablet_front.png", bg:"linear-gradient(135deg,#EAF0FF,#C9D6F3)", pack:"linear-gradient(180deg,#FFFFFF 0%,#EAF0FF 48%,#6173A5 100%)"},
      // {title:"Milk\\A Tablets", name:"Dark Chocolate Chips With Coconut", desc:"Dark chocolate texture layered with subtle coconut flavour, combining creamy dairy richness with a softer tropical finish.", image:"/products/milk_tablet_front.png", bg:"linear-gradient(135deg,#FFF4D6,#EFD789)", pack:"linear-gradient(180deg,#FFFCEF 0%,#F2E0A3 48%,#C8A96E 100%)"}
    ]
  },
  oats: {
    title: "Pure oats for <em>everyday kitchens</em>.",
    desc: "Made with quality New Zealand oats, Kimberry Quick Oats focus on natural oat texture, gentle flavour and practical everyday use — from warm breakfasts to baking and family pantry cooking.",
    proof: [["800g","Each pack"],["100%","Wholegrain oats"],["0","Additives · Preservatives · Colours"]],
    products: [
      {title:"Pure\\A Oats", name:"Original", desc:"Natural oat texture designed for porridge, overnight oats, smoothies and simple everyday cooking.", image:"/products/oats_front.png", bg:"linear-gradient(135deg,#F4F8F3,#DDEBDD)", pack:"linear-gradient(180deg,#FFFFFF 0%,#E9F2E7 48%,#6F9477 100%)"}
    ]
  }
};

const useIntersectionObserver = (options: IntersectionObserverInit = { threshold: 0.12 }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && ref.current) {
          ref.current.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [options]);

  return ref;
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('oatmeal');
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useIntersectionObserver();
  const productGridRef = useRef<HTMLDivElement>(null);
  const [productIndex, setProductIndex] = useState(0);

  // 监听哈希变化 + 只有带锚点才滚动（你要的最终版）
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      // 只有带哈希才切换 + 滚动
      if (hash) {
        if (hash === 'milk-oat-flakes') setActiveCategory('oatmeal');
        if (hash === 'milk-beans') setActiveCategory('tablets');
        if (hash === 'quick-oats') setActiveCategory('oats');

        // 只有带 # 锚点才滚动
        setTimeout(() => {
          window.scrollBy({ top: 320, behavior: 'smooth' });
        }, 120);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.promo-wrap') as HTMLElement;
      const threshold = hero ? hero.offsetHeight - 80 : 0;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateProductPosition = useCallback(() => {
    const products = data[activeCategory].products;
    const maxIndex = Math.max(0, products.length - 3);
    const newIndex = Math.max(0, Math.min(productIndex, maxIndex));
    setProductIndex(newIndex);
    
    if (products.length > 3 && productGridRef.current) {
      const cardWidth = (productGridRef.current.children[0] as HTMLElement)?.offsetWidth + 24 || 0;
      productGridRef.current.style.transform = `translateX(-${newIndex * cardWidth}px)`;
    }
  }, [activeCategory, productIndex]);

  useEffect(() => {
    updateProductPosition();
    window.addEventListener('resize', updateProductPosition);
    return () => window.removeEventListener('resize', updateProductPosition);
  }, [updateProductPosition]);

  const categoryData = data[activeCategory];

  return (
    <>
      {/* 引入和HTML一致的字体（包含Cormorant Garamond） */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div className="kimberry-products-page" id="products-top">
        {/* Hero Section */}
        <section className="relative py-10"></section>

        <style>{`
          :root{
            --ink:#0E1C2E;--muted:#68788E;--forest:#1C3A5E;--forest-mid:#2A5282;
            --oat:#C8A96E;--oat-soft:#F5EBD8;--sage:#6F9477;--sage-soft:#F3F8F2;
            --blue-soft:#F2F7FC;--cream:#FBFAF6;--line:rgba(28,58,94,.10);
            --white:#FFFFFF;--shadow:0 24px 70px rgba(28,58,94,.08);
          }
          *{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          body{font-family:'Outfit',sans-serif;color:var(--ink);background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
          a{text-decoration:none;color:inherit}img{display:block;max-width:100%}
          .nav{height:76px;padding:0 6vw;display:flex;align-items:center;justify-content:space-between;
            position:fixed;top:0;left:0;right:0;z-index:100;background:transparent;transition:all .35s}
          .nav.scrolled{background:rgba(255,255,255,.88);backdrop-filter:blur(20px);border-bottom:1px solid rgba(28,58,94,.08)}
          .brand{display:flex;align-items:center;gap:12px}.logo-img{height:44px;width:auto}
          .brand-text{font-size:20px;font-weight:600;color:#fff}.nav.scrolled .brand-text{color:var(--forest)}
          .nav-links{display:flex;align-items:center;gap:36px;font-size:14px;color:rgba(255,255,255,.82);font-weight:500}
          .nav.scrolled .nav-links{color:var(--muted)}.nav-links a:hover{color:#fff}.nav.scrolled .nav-links a:hover{color:var(--forest)}
          .nav-cta{height:40px;padding:0 22px;border-radius:999px;background:rgba(255,255,255,.2);color:#fff;
            border:1px solid rgba(255,255,255,.32);display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600}
          .nav.scrolled .nav-cta{background:var(--forest);color:#fff;border-color:var(--forest)}
          .promo-wrap{padding:0;background:#F7F9F6}
          .promo-banner{min-height:300px;height:42vh;max-height:380px;width:100%;overflow:hidden;position:relative;
            background:linear-gradient(90deg,rgba(13,32,24,.58) 0%,rgba(13,32,24,.28) 44%,rgba(13,32,24,.08) 100%),
                        linear-gradient(135deg,#EAF2E7,#C8DDBF);
            display:flex;align-items:center;padding:92px 6vw 42px}
          .promo-content{position:relative;z-index:2;max-width:520px;color:#fff}
          .promo-content h2{font-family:'Cormorant Garamond',serif;font-size:clamp(30px,3.2vw,48px);line-height:.96;letter-spacing:-.05em;font-weight:300;margin-bottom:16px}
          .promo-content p{font-family:'Outfit',sans-serif;color:rgba(255,255,255,.78);font-size:13px;line-height:1.7;max-width:460px}
          .promo-products{position:absolute;inset:0;z-index:1;pointer-events:none}
          .promo-products::before{
            content:'';
            position:absolute;
            right:3vw;
            top:50%;
            width:430px;
            height:300px;
            border-radius:50%;
            background:radial-gradient(circle at 48% 52%,rgba(255,255,255,.28),transparent 44%),
                        radial-gradient(circle at 62% 62%,rgba(200,169,110,.12),transparent 48%);
            transform:translateY(-50%);
            filter:blur(4px);
          }
          /* 核心：添加hero-pack的hover动画 */
          .hero-pack{
            position:absolute;
            object-fit:contain;
            filter:drop-shadow(0 28px 46px rgba(13,32,24,.24));
            transition:transform .35s ease, filter .35s ease;
            pointer-events:auto; /* 允许鼠标交互 */
          }
          .hero-pack.oatmeal{
            width:min(18vw,245px);
            right:12vw;
            top:50%;
            transform:translateY(-52%) rotate(-10deg);
            z-index:4
          }
          .hero-pack.oatmeal:hover{
            transform:translateY(-56%) rotate(-10deg); /* 悬浮向上偏移 */
            filter:drop-shadow(0 32px 50px rgba(13,32,24,.3)); /* 增强阴影 */
          }
          .hero-pack.beans{
            width:min(13vw,175px);
            right:4vw;
            top:50%;
            transform:translateY(-22%) rotate(16deg);
            z-index:5
          }
          .hero-pack.beans:hover{
            transform:translateY(-26%) rotate(16deg); /* 悬浮向上偏移 */
            filter:drop-shadow(0 32px 50px rgba(13,32,24,.3));
          }
          .hero-pack.oats{
            width:min(15vw,210px);
            right:22vw;
            top:50%;
            transform:translateY(-12%) rotate(-16deg);
            opacity:.94;
            z-index:2
          }
          .hero-pack.oats:hover{
            transform:translateY(-16%) rotate(-16deg); /* 悬浮向上偏移 */
            filter:drop-shadow(0 32px 50px rgba(13,32,24,.3));
          }
          .category-section{padding:30px 6vw 24px;background:#F7F9F6}
          .category-row{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:220px 1fr;gap:28px;align-items:center}
          .row-label{font-family:'Outfit',sans-serif;font-size:18px;color:var(--ink);font-weight:500;letter-spacing:-.02em;text-transform: uppercase}
          .category-tabs{display:flex;gap:14px;flex-wrap:wrap;justify-content:center}
          /* 完全还原HTML中的按钮样式 */
          .category-tab{
            min-width:170px;
            height:56px;
            padding:0 24px;
            border-radius:999px;
            border:1px solid rgba(28,58,94,.08);
            background:rgba(255,255,255,.72);
            color:var(--forest);
            display:inline-flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
            font-size:14px;
            font-weight:700;
            letter-spacing:.05em;
            text-transform:uppercase;
            transition:background .2s, color .2s, transform .2s, box-shadow .2s;
          }
          .category-tab:hover{
            transform:translateY(-2px);
            box-shadow:0 12px 30px rgba(28,58,94,.07);
          }
          .category-tab.active{
            background:var(--forest);
            color:#fff;
            box-shadow:0 16px 36px rgba(28,58,94,.14);
          }
          .intro-section{padding:44px 6vw 20px;background:radial-gradient(circle at 12% 10%,rgba(200,169,110,.08),transparent 26%),linear-gradient(180deg,#FFFFFF 0%,#F7F9F6 100%);text-align:center}
          .intro-section h2{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,4.1vw,58px);line-height:1;font-weight:300;letter-spacing:-.055em;max-width:820px;margin:0 auto 16px}
          .intro-section h2 em{font-style:italic;color:var(--sage)}
          .intro-text{font-family:'Outfit',sans-serif;max-width:760px;margin:0 auto;color:var(--muted);font-size:15px;line-height:1.65}
          .intro-proof{max-width:900px;margin:22px auto 0;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:14px}
          .proof-item{padding:16px 14px;border-radius:20px;background:rgba(255,255,255,.72);border:1px solid rgba(28,58,94,.06);box-shadow:0 14px 36px rgba(28,58,94,.035)}
          .proof-item b{display:block;font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;color:var(--forest);line-height:1;margin-bottom:6px}
          .proof-item span{color:var(--muted);font-size:10px;line-height:1.35;text-transform:none;letter-spacing:.08em;font-weight:650}
          .series-section{padding:10px 6vw 72px;background:radial-gradient(circle at 88% 18%,rgba(111,148,119,.10),transparent 28%),linear-gradient(180deg,#F7F9F6 0%,#FFFFFF 100%)}
          .range-heading{max-width:1120px;margin:0 auto 18px;display:flex;align-items:end;justify-content:space-between;gap:20px}
          .range-heading span{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--forest)}
          .range-heading p{color:var(--muted);font-size:13px;line-height:1.5;max-width:360px;text-align:right}
          .product-carousel-shell{max-width:1120px;margin:0 auto;position:relative;overflow:hidden}
          .product-carousel-shell.show-arrows{padding:0 62px}
          .product-arrow{
            position:absolute;
            top:50%;
            transform:translateY(-50%);
            z-index:8;
            width:46px;
            height:46px;
            border-radius:999px;
            border:1px solid rgba(28,58,94,.10);
            background:rgba(255,255,255,.84);
            color:var(--forest);
            display:none;
            align-items:center;
            justify-content:center;
            font-size:32px;
            line-height:1;
            cursor:pointer;
            box-shadow:0 14px 38px rgba(28,58,94,.08);
            transition:background .2s,color .2s,transform .2s;
          }
          .product-arrow:hover{
            background:var(--forest);
            color:#fff;
            transform:translateY(-50%) scale(1.04);
          }
          .product-arrow-prev{left:0}
          .product-arrow-next{right:0}
          .product-carousel-shell.show-arrows .product-arrow{display:flex}
          .product-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;transition:transform .45s cubic-bezier(.77,0,.18,1)}
          .product-card{
            border-radius:32px;
            overflow:hidden;
            background:rgba(255,255,255,.80);
            border:1px solid rgba(28,58,94,.06);
            box-shadow:0 18px 50px rgba(28,58,94,.055);
            transition:transform .28s ease,box-shadow .28s ease,background .28s ease;
          }
          .product-card:hover{
            transform:translateY(-6px);
            background:#fff;
            box-shadow:0 28px 70px rgba(28,58,94,.10);
          }
          .product-image{
            height:260px;
            display:grid;
            place-items:center;
            position:relative;
            overflow:hidden;
          }
          .product-image::before{
            content:'';
            position:absolute;
            inset:0;
            background:radial-gradient(circle at 52% 38%,rgba(255,255,255,.92),transparent 28%),var(--image-bg);
          }
          .product-photo{
            position:relative;
            z-index:1;
            width:min(76%,220px);
            max-height:220px;
            object-fit:contain;
            filter:drop-shadow(0 22px 34px rgba(28,58,94,.16));
          }
          .product-content{padding:20px 22px 22px}
          .product-content h3{
            font-family:'Cormorant Garamond',serif;
            font-size:28px;
            line-height:1;
            font-weight:400;
            letter-spacing:-.04em;
            margin-bottom:8px;
            color:var(--ink);
          }
          .product-content p{
            color:var(--muted);
            font-size:13px;
            line-height:1.55;
            margin-bottom:0;
          }
          .cta{
            padding:58px 6vw 62px;
            background:radial-gradient(circle at 18% 18%,rgba(200,169,110,.10),transparent 28%),
                        radial-gradient(circle at 82% 72%,rgba(111,148,119,.12),transparent 30%),
                        linear-gradient(135deg,#F7F8F5 0%,#EEF4EF 52%,#F8F5ED 100%);
            color:var(--ink);
            text-align:center;
          }
          .cta h2{
            font-family:'Cormorant Garamond',serif;
            font-size:clamp(34px,4vw,58px);
            line-height:1;
            letter-spacing:-.055em;
            font-weight:300;
            max-width:840px;
            margin:0 auto 18px;
            color:var(--ink);
          }
          .cta p{
            font-family:'Outfit',sans-serif;
            max-width:640px;
            margin:0 auto 28px;
            color:var(--muted);
            line-height:1.7;
          }
          .cta a{
            height:44px;
            padding:0 24px;
            border-radius:999px;
            background:var(--forest);
            color:#fff;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            font-size:13px;
            font-weight:700;
            letter-spacing:.04em;
            box-shadow:0 14px 32px rgba(28,58,94,.12);
          }
          footer h5{
            font-size:12px;
            font-weight:650;
            letter-spacing:.14em;
            text-transform:uppercase;
            color:rgba(255,255,255,.4);
            margin-bottom:18px;
          }
          footer a,footer p{
            display:block;
            font-size:14px;
            color:rgba(255,255,255,.62);
            margin-bottom:10px;
          }
          footer a:hover{color:var(--oat)}
          .footer-brand-row{display:flex;align-items:center;gap:12px;margin-bottom:16px}
          .footer-brand-row img{height:52px}
          .footer-brand-row span{color:var(--oat);font-size:22px;font-weight:600}
          .footer-tagline{max-width:280px;line-height:1.65}
          .footer-bottom{
            grid-column:1/-1;
            margin-top:42px;
            padding-top:24px;
            border-top:1px solid rgba(255,255,255,.1);
            display:flex;
            justify-content:space-between;
            gap:20px;
            font-size:12px;
            color:rgba(255,255,255,.34);
          }
          .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
          .reveal.visible{opacity:1;transform:none}
          @media(max-width:1000px){
            .category-row,.series-row,.details-panel{grid-template-columns:1fr}
            .row-label{text-align:center}
            .series-tabs,.category-tabs{justify-content:center}
            .product-grid,.intro-proof{grid-template-columns:1fr}
            .product-carousel-shell.show-arrows{padding:0}
            .product-carousel-shell.show-arrows .product-arrow{display:none}
            .product-grid{transform:none!important}
            footer{grid-template-columns:1fr 1fr}
          }
          @media(max-width:760px){
            .nav-links,.nav-cta{display:none}
            .promo-wrap{padding:0}
            .promo-banner{border-radius:0;min-height:260px;height:auto;max-height:none;padding:96px 6vw 54px}
            .promo-products{opacity:.24}
            .hero-pack.oatmeal{width:190px;right:0;top:52%}
            .hero-pack.beans{width:132px;right:-28px;top:58%}
            .hero-pack.oats{width:150px;right:120px;top:58%}
            .category-row,.series-row{gap:18px}
            .category-tab{min-width:100%;height:52px}
            .series-tab{min-width:calc(50% - 8px)}
            .intro-section{padding:34px 6vw 18px}
            .series-section{padding:8px 6vw 52px}
            .range-heading{display:block;text-align:center;margin-bottom:22px}
            .range-heading p{text-align:center;margin:8px auto 0}
            .product-image{height:240px}
            .details-panel{padding:24px}
            footer{grid-template-columns:1fr;gap:34px}
            .footer-bottom{flex-direction:column}
          }
        `}</style>

        <section className="promo-wrap">
          <div className="promo-banner">
            <div className="promo-content">
              <h2>Better ingredients, better everyday foods.</h2>
              <p>Built with quality New Zealand milk and oats, Kimberry creates simple everyday foods using trusted local ingredients — proudly made in New Zealand.</p>
            </div>
            <div className="promo-products">
              <img src="/products/classic_milk_oatmeal_front.png" alt="Oatmeal" className="hero-pack oatmeal" />
              <img src="/products/milk_beans_front.png" alt="Tablets" className="hero-pack beans" />
              <img src="/products/oats_front.png" alt="Oats" className="hero-pack oats" />
            </div>
          </div>
        </section>

        <section className="category-section" id="products">
          <div className="category-row">
            <div className="row-label">Product categories</div>
            <div className="category-tabs">
              <button 
                className={`category-tab ${activeCategory === 'oatmeal' ? 'active' : ''}`} 
                onClick={() => setActiveCategory('oatmeal')}
              >
                Milk Oat Flakes
              </button>
              <button 
                className={`category-tab ${activeCategory === 'tablets' ? 'active' : ''}`} 
                onClick={() => setActiveCategory('tablets')}
              >
                Milk Beans
              </button>
              <button 
                className={`category-tab ${activeCategory === 'oats' ? 'active' : ''}`} 
                onClick={() => setActiveCategory('oats')}
              >
                Quick Oats
              </button>
            </div>
          </div>
        </section>

        <section className="intro-section">
          <h2 dangerouslySetInnerHTML={{ __html: categoryData.title }} />
          <p className="intro-text">{categoryData.desc}</p>
          <div className="intro-proof">
            {categoryData.proof.map(([v, l], i) => (
              <div key={i} className="proof-item">
                <b>{v}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="series-section">
          <div className="range-heading">
            <span>Flavour Profiles</span>
          </div>
          <div className={`product-carousel-shell ${categoryData.products.length > 3 ? 'show-arrows' : ''}`}>
            <button 
              className="product-arrow product-arrow-prev" 
              onClick={() => setProductIndex(p => Math.max(0, p-1))}
              aria-label="Previous products"
            >
              ‹
            </button>
            <div ref={productGridRef} className="product-grid">
              {categoryData.products.map((p, i) => (
                <article key={i} className="product-card reveal visible">
                  <div 
                    className="product-image" 
                    style={{ '--image-bg': p.bg } as React.CSSProperties}
                  >
                    <img className="product-photo" src={p.image} alt={p.name} />
                  </div>
                  <div className="product-content">
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                  </div>
                </article>
              ))}
            </div>
            <button 
              className="product-arrow product-arrow-next" 
              onClick={() => setProductIndex(p => Math.min(p+1, categoryData.products.length-3))}
              aria-label="Next products"
            >
              ›
            </button>
          </div>
        </section>

        <section className="cta">
          <h2>Interested in listing or distributing Kimberry products?</h2>
          <p>For wholesale, retail listing and export partnership enquiries, contact Kimberry directly. We can provide product information, specifications and supply coordination.</p>
          <Link href="/contact" className="inline-block bg-[#1C3A5E] text-white py-3 px-6 rounded-lg hover:bg-[#1C3A5E]/80 transition-colors">
            Contact Us
          </Link>
        </section>

      </div>
    </>
  );
}