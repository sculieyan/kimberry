"use client";
import React from 'react';

const KimberryContactUs: React.FC = () => {
  return (
    <div className="contact-page">
      {/* 样式部分 - 在实际项目中建议抽离到单独的 CSS/SCSS 文件 */}
      <style>{`
        :root{
          --ink:#0E1C2E;
          --muted:#5F6E80;
          --forest:#1C3A5E;
          --blue:#0B5D8F;
          --oat:#C2A15D;
          --cream:#FAF7EF;
          --mist:#F7F9F6;
          --line:rgba(14,28,46,.12);
          --white:#fff;
          --shadow:0 24px 70px rgba(28,58,94,.08);
        }

        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        @media (prefers-reduced-motion: reduce){
          *{animation:none!important;transition:none!important;scroll-behavior:auto!important}
        }
        body{
          font-family:'Outfit',sans-serif;
          color:var(--ink);
          background:#fff;
          line-height:1.65;
          -webkit-font-smoothing:antialiased;
          text-rendering:optimizeLegibility;
          overflow-x:hidden;
        }
        a{text-decoration:none;color:inherit}
        img{display:block;max-width:100%}

        /* HERO */
        .contact-hero{
          min-height:300px;
          height:42vh;
          max-height:380px;
          width:100vw;
          display:flex;
          align-items:center;
          padding:92px 6vw 42px;
          color:#fff;
          background:
            linear-gradient(90deg,rgba(13,32,24,.56) 0%,rgba(28,58,94,.22) 46%,rgba(250,247,239,.06) 100%),
            url('contact_banner.jpeg') center/cover no-repeat,
            linear-gradient(135deg,#EEF4EA,#D7E5CF);
          position:relative;
          overflow:hidden;
        }
        .contact-hero::after{
          content:'';
          position:absolute;
          inset:0;
          background:radial-gradient(circle at 80% 18%,rgba(255,255,255,.20),transparent 28%);
          pointer-events:none;
        }
        .contact-hero-content{
          position:relative;
          z-index:1;
          max-width:580px;
        }
        .contact-hero-content span{
          display:inline-flex;
          height:30px;
          padding:0 14px;
          align-items:center;
          border-radius:999px;
          background:rgba(255,255,255,.18);
          border:1px solid rgba(255,255,255,.24);
          backdrop-filter:blur(10px);
          font-size:11px;
          font-weight:650;
          letter-spacing:.12em;
          text-transform:uppercase;
          margin-bottom:18px;
        }
        .contact-hero-content h1{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(36px,4vw,58px);
          line-height:.96;
          letter-spacing:-.05em;
          font-weight:300;
          margin-bottom:16px;
        }
        /* 目标文本改为 Outfit 字体 */
        .contact-hero-content p{
          max-width:520px;
          color:rgba(255,255,255,.84);
          font-size:14px;
          line-height:1.65;
          font-family: 'Outfit', sans-serif;
        }

        /* CONTENT */
        .contact-main{
          background:
            radial-gradient(circle at 12% 12%,rgba(194,161,93,.10),transparent 28%),
            linear-gradient(180deg,#FFFFFF 0%,var(--mist) 100%);
          padding:74px 6vw 92px;
        }
        .contact-intro{
          max-width:900px;
          margin:0 auto 48px;
          text-align:center;
        }
        .contact-intro h2{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(42px,5vw,76px);
          line-height:1;
          letter-spacing:-.055em;
          font-weight:300;
          color:var(--ink);
          margin-bottom:18px;
        }
        .contact-intro h2 em{
          font: inherit;
          display: inline-block;
          transform: skewX(-14deg);
          margin-left: 0.08em;
          color:#6F9477;
        }
        .contact-intro p{
          max-width:660px;
          margin:0 auto;
          color:var(--muted);
          font-size:16px;
          line-height:1.8;
          font-family: 'Outfit', sans-serif;
        }
        .contact-grid{
          max-width:1080px;
          margin:0 auto;
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:24px;
        }
        .contact-card{
          background:rgba(255,255,255,.78);
          border:1px solid rgba(28,58,94,.07);
          border-radius:34px;
          padding:42px;
          box-shadow:0 22px 62px rgba(28,58,94,.055);
          transition:transform .3s ease, box-shadow .3s ease, background .3s ease;
        }
        .contact-card:hover{
          transform:translateY(-4px);
          background:#fff;
          box-shadow:0 30px 78px rgba(28,58,94,.09);
        }
        .contact-icon{
          width:54px;
          height:54px;
          border-radius:18px;
          display:grid;
          place-items:center;
          background:var(--forest);
          color:var(--oat);
          margin-bottom:28px;
        }
        .contact-icon svg{
          width:24px;height:24px;
        }
        .contact-card h3{
          font-family:'Cormorant Garamond',serif;
          font-size:38px;
          line-height:1;
          font-weight:400;
          letter-spacing:-.04em;
          margin-bottom:14px;
        }
        .contact-card p{
          color:var(--muted);
          font-size:15px;
          line-height:1.75;
          margin-bottom:24px;
          font-family: 'Outfit', sans-serif;
        }
        .email-link{
          display:inline-flex;
          align-items:center;
          gap:10px;
          min-height:46px;
          padding:0 18px;
          border-radius:999px;
          background:var(--forest);
          color:#fff;
          font-size:14px;
          font-weight:650;
          letter-spacing:.02em;
          transition:background .2s, transform .2s;
        }
        .email-link:hover{
          background:#2A5282;
          transform:translateY(-1px);
        }

        .address-text{
          margin-top:16px;
          color:var(--muted);
          font-size:14px;
          line-height:1.7;
        }

        .note-band{
          max-width:1080px;
          margin:28px auto 0;
          padding:28px 34px;
          border-radius:28px;
          background:rgba(255,255,255,.62);
          border:1px solid rgba(28,58,94,.06);
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px 36px;
          align-items:start;
          color:var(--muted);
          font-size:14px;
          line-height:1.8;
          font-family: 'Outfit', sans-serif;
        }
        .note-item strong{
          color:var(--forest);
          font-weight:650;
        }
        .note-band strong{
          color:var(--forest);
          font-weight:650;
        }

        /* 响应式 */
        @media(max-width:900px){
          .contact-grid{grid-template-columns:1fr}
        }
        @media(max-width:620px){
          .contact-hero{min-height:260px;height:auto;max-height:none;padding:82px 28px 34px}
          .contact-main{padding:54px 6vw 72px}
          .contact-card{padding:30px}
      
          .address-text{
            margin-top:16px;
            color:var(--muted);
            font-size:14px;
            line-height:1.7;
          }
      
          .note-band{display:block}
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative py-10"></section>

      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Let’s talk about products, distribution and partnership.</h1>
          <p>Whether you have questions about our products or want to discuss distribution, our team will direct your enquiry to the right place.</p>
        </div>
      </section>

      {/* 主要内容 */}
      <main className="contact-main">
        <div className="contact-intro">
          <h2>How can we <em>help?</em></h2>
          <p>Please choose the most relevant contact below. This helps us respond faster and make sure your enquiry reaches the right team.</p>
        </div>

        <div className="contact-grid">
          <article className="contact-card">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6.5h16v11H4z" />
                <path d="M4 7l8 6 8-6" />
              </svg>
            </div>
            <h3>Product Enquiries</h3>
            <p>If you have questions about Kimberry products, ingredients, specifications or general product information, please contact us here.</p>
            <a className="email-link" href="mailto:info@Kimberry.co.nz">info@Kimberry.co.nz</a>
          </article>

          <article className="contact-card">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 7h18" />
                <path d="M6 7v12h12V7" />
                <path d="M8 7a4 4 0 0 1 8 0" />
                <path d="M9 13h6" />
              </svg>
            </div>
            <h3>Distribution & Partnership</h3>
            <p>For distribution, wholesale, retail listing, export cooperation or product partnership discussions, please contact our sales team.</p>
            <a className="email-link" href="mailto:sales@kimberry.co.nz">sales@kimberry.co.nz</a>
          </article>
        </div>

        <div className="note-band">
          <div className="note-item">
            <strong>Kimberry Limited</strong> · Auckland, New Zealand
          </div>
          <div className="note-item">
            <strong>Phone</strong> · +64 9974 9488
          </div>
          <div className="note-item">
            <strong>Address</strong> · 11/85 Onehunga Mall, Onehunga, Auckland 1061, New Zealand
          </div>
          <div className="note-item">
            Warmly welcome you to visit us and feel free to call us anytime for all your inquiries.
          </div>
        </div>
      </main>
    </div>
  );
};

export default KimberryContactUs;