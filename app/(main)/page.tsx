'use client';

import styles from './main.module.css';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      const slides = newsTextSlidesRef.current.querySelectorAll(`.${styles.nts}`);
      slides.forEach((slide, idx) => {
        slide.classList.toggle(styles.active, idx === newsSlide);
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
    const revealElements = document.querySelectorAll(`.${styles.reveal}`);
    
    const revealOnScroll = () => {
      revealElements.forEach(element => {
        const elementTop = (element as HTMLElement).getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          (element as HTMLElement).classList.add(styles.visible);
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
      <div className={styles.pageWrapper}>
        {/* HERO CAROUSEL */}
        <section className={styles.hero} id="home">
          <div className={styles.carousel} id="carousel">
            <div className={styles.slidesTrack} ref={trackRef}>
              {/* Slide 1 */}
              <div className={`${styles.slide} ${styles.slide1}`}>
                <div className={styles.slideNoise}></div>
                <div className={`${styles.slideText} ${styles.heroBrandStatement}`}>
                  <div className={styles.slideEyebrow}>New Zealand Food Company</div>
                  <h1 className={styles.slideHeadline}>
                    <span className={styles.heroYears}>17 Years</span>
                    <span className={styles.heroMade}>Made in New Zealand</span>
                  </h1>
                  <div className={styles.heroValues}>Purity · Health · Nutrition</div>
                </div>
                <div className={styles.slideVisual} aria-hidden="true"></div>
              </div>

              {/* Slide 2 */}
              <div className={`${styles.slide} ${styles.slide2}`}>
                <div className={styles.slideNoise}></div>
                <div className={styles.slideText}>
                  <div className={styles.slideEyebrow}>Simple Ingredients</div>
                  <h1 className={styles.slideHeadline}>Clean food for <em>modern</em> families.</h1>
                  <p className={styles.slideBody}>Real dairy nutrition, whole oats and natural taste — our recipes stay simple because the best ingredients need nothing added. Trusted by families across New Zealand.</p>
                </div>
              </div>

              {/* Slide 3 */}
              <div className={`${styles.slide} ${styles.slide3}`}>
                <div className={styles.slideNoise}></div>
                <div className={styles.slideText}>
                  <div className={styles.slideEyebrow}>Export & Distribution</div>
                  <h1 className={styles.slideHeadline}>Local quality, <em>global</em> reach.</h1>
                  <p className={styles.slideBody}>From New Zealand farms to retail shelves worldwide, Kimberry supports overseas market entry with reliable supply, MPI-compliant documentation and stable distribution coordination.</p>              
                </div>
              </div>
            </div>

            <div className={styles.carouselControls}>
              <div className={styles.carouselDots} id="dots">
                {[0, 1, 2].map((i) => (
                  <span 
                    key={i}
                    className={`${styles.cDot} ${currentSlide === i ? styles.active : ''}`} 
                    data-i={i}
                    onClick={() => changeSlide(i)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* NEWS INTRO */}
        {/* <section className={styles.newsIntroSection}>
          <div className={`${styles.newsIntroInner} ${styles.reveal}`}>
            <h2>What we've been up to</h2>
          </div>
        </section> */}

        {/* NEWS */}
        {/* <section className={styles.newsSection} id="news">
          <div className={styles.newsInner}> */}
            {/* Left: image panel */}
            {/* <div className={styles.newsImgPanel}>
              <div className={styles.newsImgTrack} ref={newsImgTrackRef}>
                <div className={`${styles.newsImgSlide} ${styles.ni1}`}><span className={styles.niLabel}>International Exhibition</span></div>
                <div className={`${styles.newsImgSlide} ${styles.ni2}`}><span className={styles.niLabel}>Premium Retail</span></div>
              </div> */}
              {/* progress bar */}
              {/* <div className={styles.newsProgressWrap}>
                <div className={styles.newsProgressBar} ref={newsProgressRef}></div>
              </div>
            </div> */}

            {/* Right: text panel */}
            {/* <div className={styles.newsTextPanel}>
              <div className={styles.labelTag}>Latest News from Kimberry</div>

              <div className={styles.newsSlidesText} ref={newsTextSlidesRef}>
                <div className={`${styles.nts} ${styles.active}`}>
                  <h3 className={styles.ntsTitle}>Kimberry featured at one of China's largest international import expos.</h3>
                  <div className={styles.newsCapsules}>
                    <span className={styles.newsPill}>International Exhibition</span>
                    <span className={styles.newsPill}>China</span>
                  </div>
                  <p className={styles.ntsBody}>Our products were invited to showcase at the China Asia-Pacific in Shanghai — a major national-level trade event bringing together global brands, retailers and international buyers.</p>
                </div>
                <div className={styles.nts}>
                  <h3 className={styles.ntsTitle}>Kimberry products available through premium retail channels in China.</h3>
                  <p className={styles.ntsBody}>Since 2021, Kimberry products have been available through premium retail channels in China, including Sam's Club China, helping bring New Zealand-made everyday foods to more families across Asia.</p>
                </div>
              </div>

              <div className={styles.newsNavRow}>
                <div className={styles.newsCounter}>
                  <span id="newsCur">{`0${newsSlide + 1}`}</span>
                  <span className={styles.ncSep}>/</span>
                  <span className={styles.ncTotal}>{`0${totalNewsSlides}`}</span>
                </div>
                <div className={styles.newsNavBtns}>
                  <button className={styles.nBtn} id="newsPrev" aria-label="Previous news" onClick={() => changeNewsSlide(-1)}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M10 12L6 8l4-4" />
                    </svg>
                  </button>
                  <button className={`${styles.nBtn} ${styles.nBtnNext}`} id="newsNext" aria-label="Next news" onClick={() => changeNewsSlide(1)}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M6 12l4-4-4-4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* PRODUCTS */}
        <section className={styles.productsSection} id="products">
          <div className={`${styles.sectionHeader} ${styles.reveal}`} style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '42px' }}>
            <div>
              <h2 className={styles.sectionTitle}>Our <em>Products.</em></h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>Clean ingredients. Gentle nutrition. Everyday goodness from New Zealand.</p>
            </div>
          </div>

          <div className={styles.productsGrid}>
            {/* 卡片1：Milk Oat Flakes → 跳转到对应锚点 */}
            <Link href="/products#milk-oat-flakes" className={`${styles.productCard} ${styles.reveal}`}>
              <div className={`${styles.productVisual} ${styles.pv1}`}>
                <Image 
                  className={styles.productImage} 
                  src="/products/classic_milk_oatmeal_front.png" 
                  alt="Kimberry Milk Oats Flakes"
                  width={200}
                  height={250}
                  priority
                />
              </div>
              <div className={styles.productContent}>
                <div className={styles.productName}>Milk Oat Flakes</div>
                <div className={styles.productDesc}>Creamy oats, gentle dairy nutrition, made for everyday mornings.</div>
              </div>
            </Link>

            {/* 卡片2：Milk Beans → 精准跳转到 Milk Beans 区域（你要的效果） */}
            <Link href="/products#milk-beans" className={`${styles.productCard} ${styles.reveal}`}>
              <div className={`${styles.productVisual} ${styles.pv2}`}>
                <Image 
                  className={styles.productImage} 
                  src="/products/milk_beans_front.png" 
                  alt="Kimberry Milk Beans"
                  width={200}
                  height={250}
                  priority
                />
              </div>
              <div className={styles.productContent}>
                <div className={styles.productName}>Milk Beans</div>
                <div className={styles.productDesc}>Better everyday snacking, made with real milk.</div>
              </div>
            </Link>

            {/* 卡片3：Pure Oats → 跳转到对应锚点 */}
            <Link href="/products#quick-oats" className={`${styles.productCard} ${styles.reveal}`}>
              <div className={`${styles.productVisual} ${styles.pv3}`}>
                <Image 
                  className={styles.productImage} 
                  src="/products/oats_front.png" 
                  alt="Kimberry Pure Oats"
                  width={200}
                  height={250}
                  priority
                />
              </div>
              <div className={styles.productContent}>
                <div className={styles.productName}>Pure Oats</div>
                <div className={styles.productDesc}>Pure oats, honest ingredients, naturally satisfying.</div>
              </div>
            </Link>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection} id="feedback">
          <div className={`${styles.sectionHeader} ${styles.reveal}`} style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '42px' }}>
            <div>
              <h2 className={`${styles.sectionTitle} ${styles.reviewsTitle}`}>What people say about <em>Kimberry.</em></h2>
              <p className={`${styles.sectionSub} ${styles.center}`}>Real voices from families, office workers and active everyday users who enjoy Kimberry as part of daily life.</p>
            </div>
          </div>

          <div className={styles.reviewGrid}>
            {/* Review 1 */}
            <div className={`${styles.reviewCard} ${styles.reveal}`}>
              <div className={styles.stars}>
                {[0,1,2,3,4].map(i => (
                  <svg key={i} className={styles.star} viewBox="0 0 16 16">
                    <path d="M8 1l1.9 3.9L14 5.6l-3 2.9.7 4.1L8 10.4l-3.7 2.2.7-4.1-3-2.9 4.1-.7z" />
                  </svg>
                ))}
              </div>
              <span className={styles.reviewQuote}>Milk Beans</span>
              <p className={styles.reviewText}>The chocolate milk tablets have such a smooth texture — they almost melt as soon as you eat them. The balance of creamy milk and dark chocolate is really satisfying without being overly sweet. I also love how simple the ingredients are. It feels like a treat you can actually feel good about giving to your children.</p>
              <div className={styles.reviewDivider}></div>
              <div className={styles.reviewAuthor}>Family customer</div>
            </div>

            {/* Review 2 - Milk Oat Flakes */}
            <div className={`${styles.reviewCard} ${styles.reveal}`}>
              <div className={styles.stars}>
                {[0,1,2,3,4].map(i => (
                  <svg key={i} className={styles.star} viewBox="0 0 16 16">
                    <path d="M8 1l1.9 3.9L14 5.6l-3 2.9.7 4.1L8 10.4l-3.7 2.2.7-4.1-3-2.9 4.1-.7z" />
                  </svg>
                ))}
              </div>
              <span className={styles.reviewQuote}>MILK OAT FLAKES</span>
              <p className={styles.reviewText}>The oats themselves are really nice and soften well after soaking, giving a smooth and comforting texture. The flavour is mild overall, which makes it easy to enjoy every day without feeling overly sweet or heavy.</p>
              <div className={styles.reviewDivider}></div>
              <div className={styles.reviewAuthor}>Office worker</div>
            </div>

            {/* Review 3 - Pure Oats */}
            <div className={`${styles.reviewCard} ${styles.reveal}`}>
              <div className={styles.stars}>
                {[0,1,2,3,4].map(i => (
                  <svg key={i} className={styles.star} viewBox="0 0 16 16">
                    <path d="M8 1l1.9 3.9L14 5.6l-3 2.9.7 4.1L8 10.4l-3.7 2.2.7-4.1-3-2.9 4.1-.7z" />
                  </svg>
                ))}
              </div>
              <span className={styles.reviewQuote}>Quick Oats</span>
              <p className={styles.reviewText}>I usually have these oats after the gym or before work when I need something quick and filling. Just hot water and a few minutes, and the texture turns really smooth and comforting. Simple ingredients, easy to prepare, and great for busy mornings.</p>
              <div className={styles.reviewDivider}></div>
              <div className={styles.reviewAuthor}>Gym-goer</div>
            </div>
            
            {/* 可补充更多评价卡片 */}
          </div>
        </section>
      </div>
    </>
  );
}