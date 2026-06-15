"use client";
import React, { useState, useEffect } from 'react';

// 定义样式常量（也可抽离到单独的 CSS 文件/Styled Components）
const styles = {
  // 根变量（可通过 CSS Variables 实现）
  rootVars: {
    '--ink': '#0E1C2E',
    '--muted': '#5F6E80',
    '--forest': '#1C3A5E',
    '--blue': '#0B5D8F',
    '--oat': '#C2A15D',
    '--cream': '#FAF7EF',
    '--line': 'rgba(14,28,46,.18)',
    '--white': '#fff',
  } as React.CSSProperties,

  // 全局样式
  global: {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    } as React.CSSProperties,
    html: {
      scrollBehavior: 'smooth',
    } as React.CSSProperties,
    body: {
      fontFamily: "'Outfit', sans-serif",
      color: 'var(--ink)',
      background: 'var(--white)',
      lineHeight: 1.65,
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
    } as React.CSSProperties,
    a: {
      textDecoration: 'none',
      color: 'inherit',
    } as React.CSSProperties,
    img: {
      display: 'block',
      maxWidth: '100%',
    } as React.CSSProperties,
  },

  // 英雄区样式
  storyHero: {
    minHeight: '300px',
    height: '42vh',
    maxHeight: '380px',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    padding: '92px 6vw 42px',
    color: '#fff',
    background: `
      linear-gradient(90deg,rgba(13,32,24,.56) 0%,rgba(28,58,94,.22) 46%,rgba(250,247,239,.06) 100%),
      url('/story/story_picture.png') center/cover no-repeat,
      linear-gradient(135deg,#EEF4EA,#D7E5CF)
    `,
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties,

  storyHeroAfter: {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 80% 18%,rgba(255,255,255,.20),transparent 28%)',
    pointerEvents: 'none',
  } as React.CSSProperties,

  storyHeroContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '760px',
    paddingTop: '18px',
  } as React.CSSProperties,

  storyHeroContentH2: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(42px,4.6vw,68px)',
    lineHeight: 0.98,
    letterSpacing: '-0.055em',
    fontWeight: 300,
    color: 'rgba(255,255,255,.94)',
    marginBottom: '20px',
    maxWidth: '720px',
    textShadow: '0 18px 38px rgba(13,32,24,.22)',
  } as React.CSSProperties,

  storyHeroContentP: {
    maxWidth: '520px',
    fontFamily: "'Outfit', sans-serif",
    color: 'rgba(255,255,255,.82)',
    fontSize: '15px',
    lineHeight: 1.55,
    fontWeight: 400,
    letterSpacing: '.01em',
    position: 'relative',
    paddingLeft: '18px',
  } as React.CSSProperties,

  storyHeroContentPBefore: {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '0.72em',
    width: '8px',
    height: '1px',
    background: 'rgba(255,255,255,.52)',
  } as React.CSSProperties,

  // 故事页面主体
  storyPage: {
    position: 'relative',
    maxWidth: '1320px',
    margin: '0 auto',
    padding: '34px 4vw 118px',
    overflow: 'hidden',
    background: `
      radial-gradient(circle at 88% 16%,rgba(200,169,110,.08),transparent 28%),
      radial-gradient(circle at 8% 72%,rgba(28,58,94,.055),transparent 26%)
    `,
  } as React.CSSProperties,

  storyLetter: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '64px 86px 78px',
    borderRadius: '34px',
    background: 'linear-gradient(180deg,rgba(255,255,255,.94),rgba(251,250,246,.88))',
    border: '1px solid rgba(28,58,94,.075)',
    boxShadow: '0 28px 80px rgba(28,58,94,.075)',
  } as React.CSSProperties,

  storyTitle: {
    textAlign: 'left',
    marginBottom: '38px',
    position: 'relative',
    zIndex: 2,
    maxWidth: '820px',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridTemplateAreas: `
      "title kicker"
      "rule kicker"
    `,
    alignItems: 'start',
    columnGap: '24px',
  } as React.CSSProperties,

  storyKicker: {
    gridArea: 'kicker',
    justifySelf: 'end',
    fontSize: '11px',
    fontWeight: 650,
    letterSpacing: '.16em',
    textTransform: 'uppercase',
    color: 'var(--forest)',
    marginTop: '18px',
    whiteSpace: 'nowrap',
    opacity: 0.82,
    fontFamily: "'Outfit', sans-serif",
    position: 'relative',
    paddingLeft: '38px',
  } as React.CSSProperties,

  storyKickerBefore: {
    content: '""',
    width: '32px',
    height: '1px',
    background: 'rgba(28,58,94,.4)',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  } as React.CSSProperties,

  storyTitleH1: {
    gridArea: 'title',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(46px,5.6vw,78px)',
    lineHeight: 0.92,
    fontWeight: 300,
    letterSpacing: '-0.06em',
    color: 'var(--ink)',
    marginBottom: '20px',
    textTransform: 'none',
  } as React.CSSProperties,

  rule: {
    gridArea: 'rule',
    width: '120px',
    height: '1px',
    background: 'rgba(200,169,110,.55)',
    margin: 0,
  } as React.CSSProperties,

  storyContent: {
    maxWidth: '820px',
    position: 'relative',
    zIndex: 2,
  } as React.CSSProperties,

  storyContentP: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '15.5px',
    lineHeight: 1.72,
    color: 'var(--muted)',
    marginBottom: '14px',
    letterSpacing: '-0.005em',
    fontWeight: 400,
  } as React.CSSProperties,

  storyContentStrong: {
    color: 'var(--ink)',
    fontWeight: 600,
  } as React.CSSProperties,

  brandBlock: {
    display: 'grid',
    gridTemplateColumns: '132px 1fr',
    gap: '26px',
    alignItems: 'center',
    margin: '22px 0 22px',
    padding: '18px 0',
    borderTop: '1px solid rgba(28,58,94,.07)',
    borderBottom: '1px solid rgba(28,58,94,.07)',
  } as React.CSSProperties,

  brandSeal: {
    width: '118px',
    height: '118px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  } as React.CSSProperties,

  brandSealImg: {
    width: '116px',
    height: '116px',
    objectFit: 'contain',
    display: 'block',
    filter: 'drop-shadow(0 14px 28px rgba(28,58,94,.06))',
  } as React.CSSProperties,

  storyValues: {
    margin: 0,
  } as React.CSSProperties,

  storyValuesP: {
    margin: 0,
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '20px',
    lineHeight: 1.16,
    letterSpacing: '-0.03em',
    color: 'var(--ink)',
    fontWeight: 400,
    fontStyle: 'italic',
    maxWidth: '640px',
  } as React.CSSProperties,

  storyValuesSpan: {
    display: 'block',
    marginBottom: '6px',
  } as React.CSSProperties,

  storyValuesWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '26px',
    margin: '8px 0 2px',
  } as React.CSSProperties,

  storyValuesSeal: {
    flexShrink: 0,
    width: '118px',
    height: '118px',
    borderRadius: '50%',
    border: '1px solid rgba(200,169,110,.32)',
    background: 'radial-gradient(circle at 50% 34%,rgba(255,255,255,.95),rgba(250,247,239,.88) 58%,rgba(200,169,110,.12) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: '0 18px 42px rgba(28,58,94,.04)',
    padding: '14px',
  } as React.CSSProperties,

  storyValuesSealSpan: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '15px',
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    color: 'var(--forest)',
    fontStyle: 'italic',
    display: 'block',
  } as React.CSSProperties,

  closingLine: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(19px,4.2vw,25px)',
    color: 'var(--ink)',
    lineHeight: 0.98,
    letterSpacing: '-0.055em',
    marginTop: '28px',
    maxWidth: '620px',
    fontWeight: 300,
  } as React.CSSProperties,

  // 修改签名样式
  storySignature: {
    marginTop: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    color: 'var(--muted)',
    fontSize: '13px',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    fontWeight: 600,
  } as React.CSSProperties,

  storySignatureBefore: {
    width: '46px',
    height: '1px',
    background: 'rgba(194, 161, 93, 0.35)', // 已调淡的燕麦金
  } as React.CSSProperties,

  // 响应式样式
  media900: {
    storyPage: {
      padding: '28px 5vw 80px',
    } as React.CSSProperties,
    storyLetter: {
      padding: '50px 38px 58px',
      borderRadius: '28px',
    } as React.CSSProperties,
    storyContent: {
      maxWidth: 'none',
    } as React.CSSProperties,
    brandBlock: {
      gridTemplateColumns: '1fr',
      gap: '22px',
    } as React.CSSProperties,
  },

  media620: {
    storyHero: {
      minHeight: '260px',
      height: 'auto',
      maxHeight: 'none',
      padding: '82px 28px 42px',
    } as React.CSSProperties,
    storyHeroContent: {
      maxWidth: '100%',
      paddingTop: '12px',
    } as React.CSSProperties,
    storyHeroContentH2: {
      fontSize: '40px',
      lineHeight: 1.02,
      maxWidth: '520px',
    } as React.CSSProperties,
    storyHeroContentP: {
      fontSize: '14px',
    } as React.CSSProperties,
    storyLetter: {
      padding: '46px 26px 50px',
    } as React.CSSProperties,
    storyTitle: {
      display: 'block',
    } as React.CSSProperties,
    storyKicker: {
      margin: '0 0 16px',
      paddingLeft: '36px',
    } as React.CSSProperties,
    storyTitleH1: {
      fontSize: '48px',
    } as React.CSSProperties,
    storyContentP: {
      fontSize: '15px',
      lineHeight: 1.78,
    } as React.CSSProperties,
    storyValuesP: {
      fontSize: '24px',
      lineHeight: 1.28,
    } as React.CSSProperties,
    storyValuesWrap: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '16px',
    } as React.CSSProperties,
    storyValuesSeal: {
      width: '110px',
      height: '110px',
    } as React.CSSProperties,
    storyValuesSealSpan: {
      fontSize: '14px',
    } as React.CSSProperties,
    brandSeal: {
      width: '118px',
      height: '118px',
    } as React.CSSProperties,
    brandSealImg: {
      width: '116px',
      height: '116px',
    } as React.CSSProperties,
  },
};

// 核心组件
const KimberryOurStory: React.FC = () => {
  return (
    <div style={styles.rootVars}>
      {/* 全局样式注入（已删除多余story-signature伪类） */}
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          html {
            scroll-behavior: smooth;
          }
          body {
            font-family: 'Outfit', sans-serif;
            color: var(--ink);
            background: var(--white);
            line-height: 1.65;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }
          img {
            display: block;
            max-width: 100%;
          }
          .story-hero-content p::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0.72em;
            width: 8px;
            height: 1px;
            background: rgba(255,255,255,.52);
          }
          .story-kicker::before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 27px;
            height: 1px;
            background: rgba(28,58,94,.22);
          }
          @media (max-width: 900px) {
            .story-page {
              padding: 28px 5vw 80px;
            }
            .story-letter {
              padding: 50px 38px 58px;
              border-radius: 28px;
            }
            .story-content {
              max-width: none;
            }
            .brand-block {
              grid-template-columns: 1fr;
              gap: 22px;
            }
          }
          @media (max-width: 620px) {
            .story-hero {
              min-height: 260px;
              height: auto;
              max-height: none;
              padding: 82px 28px 42px;
            }
            .story-hero-content {
              max-width: 100%;
              padding-top: 12px;
            }
            .story-hero-content h2 {
              fontSize: 40px;
              line-height: 1.02;
              max-width: 520px;
            }
            .story-hero-content p {
              fontSize: 14px;
            }
            .story-letter {
              padding: 46px 26px 50px;
            }
            .story-title {
              display: block;
            }
            .story-kicker {
              margin: 0 0 16px;
              padding-left:36px;
            }
            .story-title h1 {
              fontSize: 48px;
            }
            .story-content p {
              fontSize: 15px;
              line-height: 1.78;
            }
            .story-values p {
              fontSize: 24px;
              line-height: 1.28;
            }
            .story-values-wrap {
              flex-direction: column;
              align-items: flex-start;
              gap: 16px;
            }
            .story-values-seal {
              width: 110px;
              height: 110px;
            }
            .story-values-seal span {
              fontSize: 14px;
            }
            .brand-seal {
              width: 118px;
              height: 118px;
            }
            .brand-seal img {
              width: 116px;
              height: 116px;
            }
          }
        `}
      </style>

      {/* Hero Section */}
        <section className="relative py-10"></section>

      {/* 英雄区 */}
      <section className="story-hero" id="top" style={styles.storyHero}>
        <div className="story-hero-content" style={styles.storyHeroContent}>
          <h2 style={styles.storyHeroContentH2}>The patience to keep things simple.</h2>
          <p style={styles.storyHeroContentP}>Slower, simpler, better.</p>
        </div>
      </section>

      {/* 故事主体 */}
      <main className="story-page" style={styles.storyPage}>
        <div className="story-letter" style={styles.storyLetter}>
          <div className="story-title" style={styles.storyTitle}>
            <h1 style={styles.storyTitleH1}>Our Story</h1>
            <div className="story-kicker" style={styles.storyKicker}>
              A NOTE FROM KIMBERRY
            </div>
            <div className="rule" style={styles.rule}></div>
          </div>

          <div className="story-content" style={styles.storyContent}>
            <p style={styles.storyContentP}>
              Founded in New Zealand in 2009, Kimberry was created around a simple belief: everyday food should feel
              natural, trustworthy and quietly nourishing.
            </p>

            <div className="brand-block" style={styles.brandBlock}>
              <div className="brand-seal" style={styles.brandSeal}>
                <img src="/story/oat.png" alt="New Zealand oats" style={styles.brandSealImg} />
              </div>
              <p style={styles.storyContentP}>
                For over seventeen years, we have focused on making foods built from clean New Zealand ingredients —
                simple recipes designed not for trends, but for everyday life.
              </p>
            </div>

            <p style={styles.storyContentP}>
              In New Zealand, food is closely connected to nature. Fresh air, open farmland and a slower rhythm of
              living shape the way many families think about what they eat. At Kimberry, we carry that same mindset into
              every product we make.
            </p>

            <p style={styles.storyContentP}>We believe good food does not need to be complicated.</p>

            <div className="story-values-wrap" style={styles.storyValuesWrap}>
              <div className="story-values" style={styles.storyValues}>
                <p style={styles.storyValuesP}>
                  <span style={styles.storyValuesSpan}>Good food begins with good ingredients.</span>
                  <span style={styles.storyValuesSpan}>Nothing unnecessary added.</span>
                  <span style={styles.storyValuesSpan}>
                    And the patience to make simple things properly.
                  </span>
                </p>
              </div>

              <div className="story-values-seal" style={styles.storyValuesSeal}>
                <span style={styles.storyValuesSealSpan}>
                  Quietly<br />
                  crafted<br />
                  in New Zealand
                </span>
              </div>
            </div>

            <p style={styles.storyContentP}>That philosophy continues to guide us today.</p>

            <p style={styles.storyContentP}>
              From creamy milk oat flakes to milk-based snacks and pure oats, every Kimberry product is designed around
              comfort, simplicity and daily trust — foods made to be enjoyed regularly, not occasionally.
            </p>

            <p style={styles.storyContentP}>
              Everything is proudly made in New Zealand, using selected local ingredients and trusted food production
              standards. We avoid artificial colours, preservatives and unnecessary additives because we believe everyday
              foods should feel calm, clean and reassuring.
            </p>

            <p style={styles.storyContentP}>
              Over the years, Kimberry has gradually grown beyond New Zealand through premium retail channels,
              long-term customer relationships and international exhibitions that introduce New Zealand food quality to
              wider markets.
            </p>

            <p style={styles.storyContentP}>
              But despite that growth, our idea has never really changed. We still believe the best foods are often the
              simplest ones — honest ingredients, gentle flavour and products people can feel good about bringing home
              to their families.
            </p>

            <div className="closing-line" style={styles.closingLine}>
              Simple food, quiet quality, proudly made in New Zealand.
            </div>
            {/* 已修改：左侧淡金色横线 + 大写KIMBERRY */}
            <div className="story-signature" style={styles.storySignature}>
              <div style={styles.storySignatureBefore}></div>
              KIMBERRY
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KimberryOurStory;