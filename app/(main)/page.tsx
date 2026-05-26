'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link'

export default function Home() {
  // 导航滚动效果
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 轮播相关状态
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsSlide, setNewsSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const newsImgTrackRef = useRef<HTMLDivElement>(null);
  const newsTextSlidesRef = useRef<HTMLDivElement>(null);
  const newsProgressRef = useRef<HTMLDivElement>(null);
  
  // 轮播总数量
  const totalSlides = 3;
  const totalNewsSlides = 2;

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 英雄轮播逻辑
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // 自动轮播
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  // 新闻轮播逻辑
  useEffect(() => {
    if (newsImgTrackRef.current) {
      newsImgTrackRef.current.style.transform = `translateX(-${newsSlide * 100}%)`;
    }
    
    if (newsTextSlidesRef.current) {
      const slides = newsTextSlidesRef.current.querySelectorAll('.nts');
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === newsSlide);
      });
    }
    
    if (newsProgressRef.current) {
      newsProgressRef.current.style.width = `${((newsSlide + 1) / totalNewsSlides) * 100}%`;
    }
    
    // 自动新闻轮播
    const newsInterval = setInterval(() => {
      setNewsSlide(prev => (prev + 1) % totalNewsSlides);
    }, 6000);
    
    return () => clearInterval(newsInterval);
  }, [newsSlide]);

  // 元素显隐动画
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      revealElements.forEach(element => {
        const elementTop = (element as HTMLElement).getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          (element as HTMLElement).classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // 初始检查
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  // 切换轮播
  const changeSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // 新闻轮播切换
  const changeNewsSlide = (direction: number) => {
    let newSlide = newsSlide + direction;
    if (newSlide < 0) newSlide = totalNewsSlides - 1;
    if (newSlide >= totalNewsSlides) newSlide = 0;
    setNewsSlide(newSlide);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        
        :root {
          --cream:     #F7F8FA;
          --cream-mid: #EEF1F6;
          --oat:       #C8A96E;
          --oat-light: #EAD9B8;
          --sage:      #4A7AAA;
          --sage-soft: #E8F0F8;
          --forest:    #1C3A5E;
          --forest-mid:#2A5282;
          --terracotta:#A07840;
          --ink:       #0E1C2E;
          --muted:     #68788E;
          --line:      rgba(28,58,94,.10);
          --white:     #FFFFFF;
          --shadow:    0 24px 60px rgba(28,58,94,.12);
          --surface-oat:#F7F2E8;
          --surface-sage:#F4F8F3;
          --surface-warm:#FBFAF6;
          --surface-blue:#F5F8FB;
        }
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Outfit',sans-serif;color:var(--ink);background:#FFFFFF;line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
        a{text-decoration:none;color:inherit}
        img{display:block;max-width:100%}

        /* ── NAV ── */
        .nav{
          height:72px;padding:0 6vw;
          display:flex;align-items:center;justify-content:space-between;
          background:transparent;
          backdrop-filter:none;
          border-bottom:1px solid transparent;
          position:fixed;top:0;left:0;right:0;z-index:100;
          transition:background .35s,backdrop-filter .35s,box-shadow .35s,border-color .35s
        }
        .nav.scrolled{
          background:rgba(255,255,255,.84);
          backdrop-filter:blur(22px);
          border-bottom:1px solid rgba(28,58,94,.07);
          box-shadow:0 10px 34px rgba(28,58,94,.06)
        }
        .brand{display:flex;align-items:center;gap:12px}
        .brand-text{font-size:20px;font-weight:600;letter-spacing:.01em;color:var(--forest)}
        .logo-img{height:44px;width:auto;display:block}
        .logo-img-footer{height:52px;margin-bottom:16px}
        .nav-links{display:flex;gap:36px;font-size:14px;font-weight:500;color:var(--muted)}
        .nav-links a:hover{color:var(--forest)}
        .nav-cta{
          height:38px;padding:0 22px;border-radius:999px;
          background:var(--forest);color:var(--cream);
          font-size:13px;font-weight:600;letter-spacing:.03em;
          display:inline-flex;align-items:center;gap:8px;
          transition:background .2s,transform .15s
        }
        .nav-cta:hover{background:var(--forest-mid);transform:translateY(-1px)}
        .nav-cta svg{width:14px;height:14px}
        .nav-actions{display:flex;align-items:center;gap:14px}
        .lang-switch{
          display:inline-flex;align-items:center;gap:4px;
          height:38px;padding:3px;
          border:1px solid var(--line);border-radius:999px;
          background:rgba(255,255,255,.64);
          backdrop-filter:blur(12px)
        }
        .lang-btn{
          border:0;background:transparent;cursor:pointer;
          height:30px;padding:0 12px;border-radius:999px;
          font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;
          color:var(--muted);transition:background .2s,color .2s,box-shadow .2s
        }
        .lang-btn.active{
          background:var(--forest);color:var(--white);
          box-shadow:0 6px 16px rgba(28,58,94,.12)
        }

        /* ── HERO CAROUSEL ── */
        .hero{padding:0;margin-bottom:0;padding-top:80px;}
        .carousel{
          position:relative;height:80vh;min-height:620px;max-height:820px;width:100vw;border-radius:0;overflow:hidden;
          box-shadow:none
        }
        .carousel::before{
          content:'';
          position:absolute;
          top:0;
          left:0;
          right:0;
          height:160px;
          z-index:8;
          pointer-events:none;
          background:linear-gradient(180deg,rgba(8,20,32,.46) 0%,rgba(8,20,32,.26) 42%,rgba(8,20,32,.08) 74%,rgba(8,20,32,0) 100%);
        }
        .slides-track{display:flex;height:100%;transition:transform .75s cubic-bezier(.77,0,.18,1)}
        .slide{
          min-width:100%;height:100%;
          display:grid;grid-template-columns:1fr 1fr;
          align-items:center;padding:70px 72px;
          position:relative;overflow:hidden
        }
        .slide-1{
          background:
            linear-gradient(90deg,rgba(10,28,18,.50) 0%,rgba(10,28,18,.30) 36%,rgba(10,28,18,.08) 68%,rgba(10,28,18,.02) 100%),
            url('/home_picture_01.png') center/cover no-repeat
        }
        .slide-2{
          background:
            linear-gradient(90deg,rgba(46,32,12,.48) 0%,rgba(46,32,12,.26) 42%,rgba(46,32,12,.08) 100%),
            url('/home_picture_02.jpeg') center/cover no-repeat
        }
        .slide-3{
          background:
            linear-gradient(90deg,rgba(10,31,45,.50) 0%,rgba(10,31,45,.28) 42%,rgba(10,31,45,.08) 100%),
            url('/home_picture_03.jpeg') center/cover no-repeat
        }
        .slide-noise{
          position:absolute;inset:0;opacity:.04;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:256px;pointer-events:none
        }
        .slide-text{position:relative;z-index:1;color:#fff}
        .slide-eyebrow{
          display:inline-flex;align-items:center;gap:8px;
          font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;
          color:rgba(255,255,255,.7);margin-bottom:22px
        }
        .slide-eyebrow::before{content:'';width:28px;height:1px;background:rgba(255,255,255,.5)}
        .slide-headline{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(44px,5.2vw,80px);line-height:.95;
          font-weight:300;letter-spacing:-.02em;
          margin-bottom:22px;color:#fff
        }
        .slide-headline em{font-style:italic;color:var(--oat)}
        .slide-body{font-family:'Outfit',sans-serif;font-size:16px;line-height:1.65;color:rgba(255,255,255,.75);max-width:480px;margin-bottom:36px}
        .hero-brand-statement{max-width:620px}
        .hero-years{
          display:block;
          font-size:clamp(58px,7.2vw,118px);
          line-height:.82;
          font-weight:300;
          letter-spacing:-.055em;
          color:#fff;
          margin-bottom:8px
        }
        .hero-made{
          display:block;
          font-family:'Outfit',sans-serif;
          font-size:clamp(24px,2.8vw,46px);
          line-height:1.08;
          font-weight:600;
          letter-spacing:.08em;
          text-transform:uppercase;
          color:#fff
        }
        .hero-values{
          margin-top:26px;
          font-size:clamp(13px,1.05vw,16px);
          font-weight:500;
          letter-spacing:.22em;
          text-transform:uppercase;
          color:rgba(255,255,255,.82)
        }
        .slide-1 .slide-text{padding-top:38px}
        .slide-actions{display:flex;gap:14px;flex-wrap:wrap}
        .btn-primary{
          height:46px;padding:0 26px;border-radius:999px;
          background:var(--oat);color:var(--ink);
          font-weight:600;font-size:13px;letter-spacing:.04em;
          display:inline-flex;align-items:center;
          transition:transform .15s,box-shadow .15s
        }
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
        .btn-ghost{
          height:46px;padding:0 26px;border-radius:999px;
          border:1px solid rgba(255,255,255,.4);color:rgba(255,255,255,.9);
          font-weight:500;font-size:13px;letter-spacing:.04em;
          display:inline-flex;align-items:center;
          transition:background .2s,border-color .2s
        }
        .btn-ghost:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.7)}
        .slide-visual{
          position:relative;z-index:1;
          display:flex;justify-content:flex-end;align-items:center
        }
        .pack-container{
          width:320px;height:400px;border-radius:36px;
          background:rgba(255,255,255,.12);
          backdrop-filter:blur(12px);
          border:1px solid rgba(255,255,255,.2);
          display:grid;place-items:center;
          position:relative;overflow:hidden
        }
        .pack-container::before{
          content:'';position:absolute;
          top:-60px;right:-60px;
          width:200px;height:200px;border-radius:50%;
          background:rgba(255,255,255,.06)
        }
        .pack-inner{text-align:center;padding:20px}
        .pack-badge{
          display:inline-block;
          background:var(--forest);color:var(--oat);
          font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
          padding:6px 16px;border-radius:999px;margin-bottom:20px
        }
        .pack-name{
          font-family:'Cormorant Garamond',serif;
          font-size:32px;font-weight:600;letter-spacing:-.01em;
          color:#fff;line-height:1.1;margin-bottom:8px
        }
        .pack-sub{font-size:12px;color:rgba(255,255,255,.6);letter-spacing:.06em;text-transform:uppercase}
        .pack-img-placeholder{
          width:120px;height:160px;margin:20px auto;
          border-radius:20px;background:rgba(255,255,255,.2);
          border:1px solid rgba(255,255,255,.25);
          display:grid;place-items:center
        }
        .pack-img-placeholder svg{opacity:.5}
        .pack-tag{
          font-size:11px;color:rgba(255,255,255,.7);
          background:rgba(255,255,255,.1);
          padding:6px 14px;border-radius:999px;
          display:inline-block;margin-top:8px
        }
        .carousel-controls{
          position:absolute;bottom:32px;left:6vw;
          display:flex;align-items:center;gap:18px;z-index:10
        }
        .carousel-dots{display:flex;gap:8px}
        .c-dot{
          width:8px;height:8px;border-radius:999px;
          background:rgba(255,255,255,.4);cursor:pointer;
          transition:width .35s,background .3s
        }
        .c-dot.active{width:28px;background:#fff}
        .carousel-nav{display:flex;gap:8px;margin-left:8px}
        .c-btn{
          width:40px;height:40px;border-radius:50%;
          background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);
          color:#fff;display:grid;place-items:center;cursor:pointer;
          transition:background .2s
        }
        .c-btn:hover{background:rgba(255,255,255,.28)}
        .c-btn svg{width:16px;height:16px}

        /* ── SECTIONS SHARED ── */
        section{padding:68px 6vw}
        .label-tag{
          display:inline-flex;align-items:center;gap:8px;
          font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;
          color:var(--forest);margin-bottom:16px
        }
        .label-tag::before{content:'';width:20px;height:1px;background:var(--sage)}
        .section-title{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(36px,4.2vw,64px);font-weight:300;
          letter-spacing:-.04em;line-height:1;color:var(--ink)
        }
        .section-title em{font-style:italic;color:var(--sage)}
        .section-sub{
          /* 👇 这句已经改为 Outfit 字体 */
          font-family:'Outfit',sans-serif;
          color:var(--muted);
          font-size:16px;
          max-width:460px;
          line-height:1.65;
          margin-top:14px
        }
        .section-sub.center{
          max-width:660px;
          margin:18px auto 0;
          text-align:center
        }
        .section-header{display:flex;justify-content:space-between;align-items:flex-end;gap:56px;margin-bottom:44px}
        .see-all{
          font-size:13px;font-weight:600;color:var(--forest);
          display:inline-flex;align-items:center;gap:6px;
          letter-spacing:.04em;white-space:nowrap;flex-shrink:0
        }
        .see-all svg{width:14px;height:14px;transition:transform .2s}
        .see-all:hover svg{transform:translateX(3px)}
        .news-section + .products-section,
        .products-section + .reviews-section{margin-top:0}

        /* ── NEWS INTRO ── */
        .news-intro-section{
          background:
            linear-gradient(180deg,#FFFFFF 0%,#F7F9F6 100%);
          padding:96px 6vw 52px
        }
        .news-intro-inner{
          max-width:880px;
          margin:0 auto;
          text-align:center
        }
        .news-intro-kicker{
          display:inline-flex;
          align-items:center;
          gap:10px;
          font-size:11px;
          font-weight:600;
          letter-spacing:.18em;
          text-transform:uppercase;
          color:var(--forest);
          margin-bottom:18px
        }
        .news-intro-kicker::before,
        .news-intro-kicker::after{
          content:'';
          width:28px;
          height:1px;
          background:rgba(28,58,94,.22)
        }
        .news-intro-inner h2{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(36px,4.2vw,64px);
          font-weight:300;
          line-height:1;
          letter-spacing:-.04em;
          color:var(--ink);
          margin-bottom:18px
        }
        .news-intro-inner p{
          max-width:620px;
          margin:0 auto;
          font-size:16px;
          line-height:1.7;
          color:var(--muted)
        }

        /* ── NEWS ── */
        .news-section{
          background:#F7F9F6;
          padding:0 6vw 72px
        }
        .news-inner{
          display:grid;grid-template-columns:.46fr .54fr;
          gap:0;
          overflow:hidden;
          border:1px solid rgba(28,58,94,.06);
          border-radius:34px;
          min-height:520px;
          margin-top:0;
          background:rgba(255,255,255,.62);
          box-shadow:0 24px 70px rgba(28,58,94,.055)
        }
        .news-img-panel{
          position:relative;
          overflow:hidden;
          min-height:520px
        }
        .news-img-track{display:flex;height:100%;transition:transform .75s cubic-bezier(.77,0,.18,1)}
        .news-img-slide{
          min-width:100%;height:100%;
          display:flex;align-items:flex-end;
          padding:36px 40px;position:relative
        }
        .news-img-slide::after{
          content:'';
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg,rgba(255,255,255,.05),rgba(14,28,46,.10)),
            radial-gradient(circle at 20% 20%,rgba(255,255,255,.14),transparent 30%);
          pointer-events:none
        }
        .news-img-slide .ni-label{position:relative;z-index:1}
        .ni-1{background:linear-gradient(160deg,rgba(20,39,54,.42),rgba(20,39,54,.16)),url('/进博会logo.jpg') center/cover no-repeat}
        .ni-2{background:linear-gradient(160deg,rgba(20,39,54,.42),rgba(20,39,54,.16)),url('/山姆2.jpg') center/cover no-repeat}
        .ni-label{
          font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
          color:rgba(255,255,255,.7);background:rgba(0,0,0,.2);
          padding:7px 16px;border-radius:999px;
          backdrop-filter:blur(8px)
        }
        .news-progress-wrap{
          position:absolute;bottom:0;left:0;right:0;
          height:3px;background:rgba(255,255,255,.14)
        }
        .news-progress-bar{
          height:100%;background:rgba(255,255,255,.76);
          width:50%;
          transition:width .4s ease
        }
        .news-text-panel{
          padding:64px 64px 50px;
          display:flex;flex-direction:column;justify-content:space-between;
          background:rgba(255,255,255,.82)
        }
        .news-slides-text{flex:1;position:relative;margin-bottom:40px}
        .nts{
          position:absolute;inset:0;
          opacity:0;transform:translateY(14px);
          transition:opacity .5s ease,transform .5s ease;
          pointer-events:none
        }
        .nts.active{opacity:1;transform:none;pointer-events:auto;position:relative}
        .nts-tag{
          font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
          color:var(--sage);margin-bottom:16px
        }
        .nts-title{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(24px,2.4vw,36px);font-weight:400;letter-spacing:-.03em;
          line-height:1.15;color:var(--ink);margin-bottom:18px
        }
        /* 👇 这里已经改为 Outfit 字体 */
        .nts-body{
          font-family:'Outfit',sans-serif;
          font-size:15px;
          color:var(--muted);
          line-height:1.7;
        }
        .news-capsules{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 16px}
        .news-pill{display:inline-flex;align-items:center;height:28px;padding:0 14px;border-radius:999px;background:var(--sage-soft);color:var(--forest-mid);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
        .news-nav-row{
          display:flex;align-items:center;justify-content:space-between;
          padding-top:16px;margin-top:18px;margin-bottom:10px;border-top:1px solid rgba(28,58,94,.08)
        }
        .news-counter{display:flex;align-items:baseline;gap:4px;font-size:14px;font-weight:500;color:var(--ink)}
        .nc-sep{color:var(--muted);margin:0 2px}
        .nc-total{color:var(--muted)}
        .news-nav-btns{display:flex;gap:10px}
        .n-btn{
          width:44px;height:44px;border-radius:50%;
          border:1px solid var(--line);background:transparent;
          display:grid;place-items:center;cursor:pointer;
          transition:background .2s,border-color .2s,transform .15s;color:var(--ink)
        }
        .n-btn svg{width:16px;height:16px}
        .n-btn:hover{background:var(--forest);border-color:var(--forest);color:#fff}
        .n-btn-next{background:var(--forest);border-color:var(--forest);color:#fff}
        .n-btn-next:hover{background:var(--forest-mid);transform:translateX(2px)}

        /* ── PRODUCTS ── */
        .products-section{
          background:
            radial-gradient(circle at 8% 10%, rgba(200,169,110,.10), transparent 28%),
            radial-gradient(circle at 92% 92%, rgba(74,122,170,.08), transparent 26%),
            linear-gradient(180deg,#F7F9F6 0%,#F8FAF7 100%);
          padding:64px 6vw 70px
        }
        .products-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:24px
        }
        .product-card{
          border:1px solid rgba(28,58,94,.06);
          border-radius:28px;
          overflow:hidden;
          background:rgba(255,255,255,.74);
          box-shadow:0 18px 46px rgba(28,58,94,.045);
          transition:transform .35s ease, box-shadow .35s ease, background .35s ease
        }
        .product-card:hover{
          transform:translateY(-6px);
          background:#fff;
          box-shadow:0 26px 62px rgba(28,58,94,.09)
        }
        .product-visual{
          height:292px;
          position:relative;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden
        }
        .product-visual::after{
          content:'';
          position:absolute;
          inset:auto 16% 18px;
          height:18px;
          border-radius:50%;
          background:rgba(14,28,46,.08);
          filter:blur(12px);
          opacity:.55
        }
        .product-image{
          position:relative;
          z-index:1;
          max-width:76%;
          max-height:84%;
          object-fit:contain;
          display:block;
          filter:drop-shadow(0 18px 28px rgba(14,28,46,.12))
        }
        .pv1{background:linear-gradient(160deg,#E8F0F8 0%,#D8E5F3 100%)}
        .pv2{background:linear-gradient(160deg,#EFE4D2 0%,#E3D2B5 100%)}
        .pv3{background:linear-gradient(160deg,#E9F1EA 0%,#D6E6D8 100%)}
        .product-content{padding:28px}
        .product-name{
          font-family:'Cormorant Garamond',serif;
          font-size:34px;
          margin-bottom:10px;
          color:var(--ink)
        }
        .product-desc{
          font-family:'Outfit',sans-serif;
          font-size:14px;
          line-height:1.7;
          color:var(--muted)
        }

        /* ── REVIEWS ── */
        .reviews-section{
          background:
            radial-gradient(circle at 12% 16%, rgba(200,169,110,.08), transparent 24%),
            linear-gradient(180deg,#FFFFFF 0%,var(--surface-warm) 100%);
          padding:66px 6vw 76px
        }
        .reviews-title{white-space:nowrap}
        .review-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
        .review-card{
          background:rgba(255,255,255,.78);
          border:1px solid rgba(28,58,94,.06);
          border-radius:28px;padding:36px;
          position:relative;
          box-shadow:0 16px 44px rgba(28,58,94,.04);
          transition:transform .35s ease, box-shadow .35s ease, background .35s ease
        }
        .review-card:hover{transform:translateY(-4px);background:#fff;box-shadow:0 24px 58px rgba(42,74,46,.08)}
        .review-quote{
          display:inline-flex;
          align-items:center;
          gap:10px;
          min-height:34px;
          padding:7px 14px;
          margin-bottom:22px;
          border:1px solid rgba(200,169,110,.26);
          border-radius:999px;
          background:linear-gradient(180deg,rgba(247,242,232,.72),rgba(255,255,255,.54));
          font-family:'Outfit',sans-serif;
          font-size:11px;
          font-weight:600;
          letter-spacing:.16em;
          line-height:1;
          text-transform:uppercase;
          color:var(--forest);
          box-shadow:0 8px 22px rgba(28,58,94,.035);
          /* 新增：文字全大写，和截图一致 */
          text-transform: uppercase;
        }
        .review-quote::before{
          content:'';
          width:6px;
          height:6px;
          border-radius:50%;
          background:var(--oat);
          box-shadow:0 0 0 4px rgba(200,169,110,.12);
          flex:0 0 auto
        }
        .review-text{
          font-family:'Cormorant Garamond',serif;
          font-size:20px;font-weight:300;font-style:italic;
          line-height:1.55;color:var(--ink);margin-bottom:28px
        }
        .review-divider{width:40px;height:1px;background:var(--oat);margin-bottom:18px}
        .review-author{font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;color:var(--ink)}
        .review-role{font-size:12px;color:var(--muted);margin-top:3px}
        .stars{display:flex;gap:3px;margin-bottom:20px}
        .star{width:14px;height:14px;fill:var(--terracotta)}

        /* ── ANIMATIONS ── */
        .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}
        .reveal.visible{opacity:1;transform:none}

        /* ── RESPONSIVE ── */
        @media(max-width:1024px){
          .news-intro-section{padding:72px 6vw 42px}
          .news-inner{grid-template-columns:1fr;border-radius:28px}
          .news-img-panel{height:320px;min-height:320px}
          .news-img-track{height:320px}
          .products-grid{grid-template-columns:1fr}
        }

        @media(max-width:768px){
          .review-quote{
            font-size:30px;
          }
          .reviews-title{white-space:normal}
          .news-intro-section{padding:56px 6vw 32px}
          .news-section{padding:0 5vw 52px}
          .products-section{padding:52px 6vw 58px}
          .reviews-section{padding:54px 6vw 62px}
          .nav-links,.nav-cta{display:none}
          .nav-actions{gap:0}
          .lang-switch{height:36px}
          .lang-btn{height:28px;padding:0 10px}
          .carousel{height:auto;border-radius:0}
          .carousel::before{height:140px}
          .slide{grid-template-columns:1fr;padding:44px 36px;min-height:560px}
          .slide-visual{display:none}
          .news-text-panel{padding:40px 32px}
          .section-header{flex-direction:column;align-items:flex-start;gap:16px}
          .review-grid{grid-template-columns:1fr}
          footer{grid-template-columns:1fr 1fr;gap:40px}
          .footer-bottom{flex-direction:column;gap:8px;text-align:center}
        }
      `}</style>

      {/* HERO CAROUSEL */}
      <section className="hero" id="home">
        <div className="carousel" id="carousel">
          <div className="slides-track" ref={trackRef}>
            {/* Slide 1 */}
            <div className="slide slide-1">
              <div className="slide-noise"></div>
              <div className="slide-text hero-brand-statement">
                <div className="slide-eyebrow">New Zealand Food Company</div>
                <h1 className="slide-headline">
                  <span className="hero-years">17 Years</span>
                  <span className="hero-made">Made in New Zealand</span>
                </h1>
                <div className="hero-values">Purity · Health · Nutrition</div>
              </div>
              <div className="slide-visual" aria-hidden="true"></div>
            </div>

            {/* Slide 2 */}
            <div className="slide slide-2">
              <div className="slide-noise"></div>
              <div className="slide-text">
                <div className="slide-eyebrow">Simple Ingredients</div>
                <h1 className="slide-headline">Clean food for <em>modern</em> families.</h1>
                <p className="slide-body">Real dairy nutrition, whole oats and natural taste — our recipes stay simple because the best ingredients need nothing added. Trusted by families across New Zealand.</p>
              </div>
              <div className="slide-visual">
                <div className="pack-container">
                  <div className="pack-inner">
                    <span className="pack-badge">Daily Nutrition</span>
                    <div className="pack-name">Milk Tablets</div>
                    <div className="pack-sub">Convenient · Satisfying · Natural</div>
                    <div className="pack-img-placeholder">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect x="14" y="10" width="20" height="28" rx="10" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                        <path d="M20 22h8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="pack-tag">Replace with product photo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="slide slide-3">
              <div className="slide-noise"></div>
              <div className="slide-text">
                <div className="slide-eyebrow">Export & Distribution</div>
                <h1 className="slide-headline">Local quality, <em>global</em> reach.</h1>
                <p className="slide-body">From New Zealand farms to retail shelves worldwide, Kimberry supports overseas market entry with reliable supply, MPI-compliant documentation and stable distribution coordination.</p>              
              </div>
              <div className="slide-visual">
                <div className="pack-container">
                  <div className="pack-inner">
                    <span className="pack-badge">MPI Certified</span>
                    <div className="pack-name">Pure Oats</div>
                    <div className="pack-sub">Wholesome · Traceable · Export-ready</div>
                    <div className="pack-img-placeholder">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M24 8v32M16 16c0 0 4-2 8 0s8 0 8 0M16 24c0 0 4-2 8 0s8 0 8 0M16 32c0 0 4-2 8 0s8 0 8 0" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="pack-tag">Replace with product photo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <div className="carousel-dots" id="dots">
              {[0, 1, 2].map((i) => (
                <span 
                  key={i}
                  className={`c-dot ${currentSlide === i ? 'active' : ''}`} 
                  data-i={i}
                  onClick={() => changeSlide(i)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWS INTRO */}
      <section className="news-intro-section">
        <div className="news-intro-inner reveal">
          <h2>What we've been up to</h2>
        </div>
      </section>

      {/* NEWS */}
      <section className="news-section" id="news">
        <div className="news-inner">
          {/* Left: image panel */}
          <div className="news-img-panel">
            <div className="news-img-track" ref={newsImgTrackRef}>
              <div className="news-img-slide ni-1"><span className="ni-label">International Exhibition</span></div>
              <div className="news-img-slide ni-2"><span className="ni-label">Premium Retail</span></div>
            </div>
            {/* progress bar */}
            <div className="news-progress-wrap">
              <div className="news-progress-bar" ref={newsProgressRef}></div>
            </div>
          </div>

          {/* Right: text panel */}
          <div className="news-text-panel">
            <div className="label-tag">Latest News from Kimberry</div>

            <div className="news-slides-text" ref={newsTextSlidesRef}>
              <div className="nts active">
                <h3 className="nts-title">Kimberry featured at one of China's largest international import expos.</h3>
                <div className="news-capsules">
                  <span className="news-pill">International Exhibition</span>
                  <span className="news-pill">China</span>
                </div>
                <p className="nts-body">Our products were invited to showcase at the China Asia-Pacific in Shanghai — a major national-level trade event bringing together global brands, retailers and international buyers.</p>
              </div>
              <div className="nts">
                <h3 className="nts-title">Kimberry products available through premium retail channels in China.</h3>
                <p className="nts-body">Since 2021, Kimberry products have been available through premium retail channels in China, including Sam's Club China, helping bring New Zealand-made everyday foods to more families across Asia.</p>
              </div>
            </div>

            <div className="news-nav-row">
              <div className="news-counter">
                <span id="newsCur">{`0${newsSlide + 1}`}</span>
                <span className="nc-sep">/</span>
                <span className="nc-total">{`0${totalNewsSlides}`}</span>
              </div>
              <div className="news-nav-btns">
                <button className="n-btn" id="newsPrev" aria-label="Previous news" onClick={() => changeNewsSlide(-1)}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M10 12L6 8l4-4" />
                  </svg>
                </button>
                <button className="n-btn n-btn-next" id="newsNext" aria-label="Next news" onClick={() => changeNewsSlide(1)}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 12l4-4-4-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products-section" id="products">
        <div className="section-header reveal" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '42px' }}>
          <div>
            <h2 className="section-title">Our <em>Products.</em></h2>
            <p className="section-sub center">Clean ingredients. Gentle nutrition. Everyday goodness from New Zealand.</p>
          </div>
        </div>

        <div className="products-grid">
          {/* 卡片1：Milk Oat Flakes → 跳转到对应锚点 */}
          <Link href="/products#milk-oat-flakes" className="product-card reveal">
            <div className="product-visual pv1">
              <Image 
                className="product-image" 
                src="/products/classic_milk_oatmeal_front.png" 
                alt="Kimberry Milk Oats Flakes"
                width={200}
                height={250}
                priority
              />
            </div>
            <div className="product-content">
              <div className="product-name">Milk Oat Flakes</div>
              <div className="product-desc">Creamy oats, gentle dairy nutrition, made for everyday mornings.</div>
            </div>
          </Link>

          {/* 卡片2：Milk Beans → 精准跳转到 Milk Beans 区域（你要的效果） */}
          <Link href="/products#milk-beans" className="product-card reveal">
            <div className="product-visual pv2">
              <Image 
                className="product-image" 
                src="/products/milk_beans_front.png" 
                alt="Kimberry Milk Beans"
                width={200}
                height={250}
                priority
              />
            </div>
            <div className="product-content">
              <div className="product-name">Milk Beans</div>
              <div className="product-desc">Better everyday snacking, made with real milk.</div>
            </div>
          </Link>

          {/* 卡片3：Pure Oats → 跳转到对应锚点 */}
          <Link href="/products#quick-oats" className="product-card reveal">
            <div className="product-visual pv3">
              <Image 
                className="product-image" 
                src="/products/oats_front.png" 
                alt="Kimberry Pure Oats"
                width={200}
                height={250}
                priority
              />
            </div>
            <div className="product-content">
              <div className="product-name">Pure Oats</div>
              <div className="product-desc">Pure oats, honest ingredients, naturally satisfying.</div>
            </div>
          </Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews-section" id="feedback">
        <div className="section-header reveal" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '42px' }}>
          <div>
            <h2 className="section-title reviews-title">What people say about <em>Kimberry.</em></h2>
            <p className="section-sub center">Real voices from families, office workers and active everyday users who enjoy Kimberry as part of daily life.</p>
          </div>
        </div>

        <div className="review-grid">
          {/* Review 1 */}
          <div className="review-card reveal">
            <div className="stars">
              {[0,1,2,3,4].map(i => (
                <svg key={i} className="star" viewBox="0 0 16 16">
                  <path d="M8 1l1.9 3.9L14 5.6l-3 2.9.7 4.1L8 10.4l-3.7 2.2.7-4.1-3-2.9 4.1-.7z" />
                </svg>
              ))}
            </div>
            <span className="review-quote">Milk Beans</span>
            <p className="review-text">The chocolate milk tablets have such a smooth texture — they almost melt as soon as you eat them. The balance of creamy milk and dark chocolate is really satisfying without being overly sweet. I also love how simple the ingredients are. It feels like a treat you can actually feel good about giving to your children.</p>
            <div className="review-divider"></div>
            <div className="review-author">Family customer</div>
          </div>

          {/* Review 2 - Milk Oat Flakes */}
          <div className="review-card reveal">
            <div className="stars">
              {[0,1,2,3,4].map(i => (
                <svg key={i} className="star" viewBox="0 0 16 16">
                  <path d="M8 1l1.9 3.9L14 5.6l-3 2.9.7 4.1L8 10.4l-3.7 2.2.7-4.1-3-2.9 4.1-.7z" />
                </svg>
              ))}
            </div>
            <span className="review-quote">MILK OAT FLAKES</span>
            <p className="review-text">The oats themselves are really nice and soften well after soaking, giving a smooth and comforting texture. The flavour is mild overall, which makes it easy to enjoy every day without feeling overly sweet or heavy.</p>
            <div className="review-divider"></div>
            <div className="review-author">Office worker</div>
          </div>

          {/* Review 3 - Pure Oats */}
          <div className="review-card reveal">
            <div className="stars">
              {[0,1,2,3,4].map(i => (
                <svg key={i} className="star" viewBox="0 0 16 16">
                  <path d="M8 1l1.9 3.9L14 5.6l-3 2.9.7 4.1L8 10.4l-3.7 2.2.7-4.1-3-2.9 4.1-.7z" />
                </svg>
              ))}
            </div>
            <span className="review-quote">Quick Oats</span>
            <p className="review-text">I usually have these oats after the gym or before work when I need something quick and filling. Just hot water and a few minutes, and the texture turns really smooth and comforting. Simple ingredients, easy to prepare, and great for busy mornings.</p>
            <div className="review-divider"></div>
            <div className="review-author">Gym-goer</div>
          </div>
          
          {/* 可补充更多评价卡片 */}
        </div>
      </section>
    </>
  );
}