// api/index.js
export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>PinBot — Amazon to Pinterest, Automated</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet"/>
<style>
:root {
  --red: #e60023;
  --red-dim: #b8001c;
  --red-glow: rgba(230,0,35,0.12);
  --bg: #070707;
  --bg2: #0c0c0c;
  --bg3: #111111;
  --bg4: #161616;
  --border: rgba(255,255,255,0.04);
  --border-soft: rgba(255,255,255,0.08);
  --text: #ede9e4;
  --text2: #9a9692;
  --text3: #4a4744;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }

body {
  font-family:'DM Sans', sans-serif;
  background:var(--bg);
  color:var(--text);
  min-height:100vh;
  overflow-x:hidden;
}

/* Grain overlay */
body::after {
  content:'';
  position:fixed;
  inset:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events:none;
  z-index:999;
  opacity:0.3;
}

/* Ambient orbs */
.orb {
  position:fixed;border-radius:50%;pointer-events:none;z-index:0;
  filter:blur(120px);opacity:0.1;
  animation:drift 18s ease-in-out infinite alternate;
}
.orb-1{width:800px;height:800px;background:radial-gradient(circle,#e60023,transparent 70%);top:-350px;left:-250px;animation-delay:0s;}
.orb-2{width:550px;height:550px;background:radial-gradient(circle,#ff4458,transparent 70%);bottom:-250px;right:-180px;animation-delay:-9s;}
.orb-3{width:400px;height:400px;background:radial-gradient(circle,#c2006e,transparent 70%);top:40%;left:55%;animation-delay:-5s;}
@keyframes drift{from{transform:translate(0,0) scale(1);}to{transform:translate(50px,40px) scale(1.08);}}

.page{position:relative;z-index:1;}

/* ── NAV ── */
nav{
  position:sticky;top:0;z-index:100;
  display:flex;justify-content:space-between;align-items:center;
  padding:0 clamp(20px, 5vw, 64px);height:68px;
  background:rgba(7,7,7,0.8);
  backdrop-filter:blur(28px);
  -webkit-backdrop-filter:blur(28px);
  border-bottom:1px solid transparent;
  transition:background 0.3s, border-color 0.3s;
  animation:navIn 0.5s ease both;
}
nav.scrolled {
  background:rgba(7,7,7,0.96);
  border-bottom-color:var(--border);
}
@keyframes navIn{from{transform:translateY(-68px);}to{transform:translateY(0);}}

.logo{
  font-family:'Syne',sans-serif;font-weight:800;font-size:22px;
  display:flex;align-items:center;gap:10px;letter-spacing:-0.5px;
  text-decoration:none;color:var(--text);flex-shrink:0;
}
.logo-mark{
  width:32px;height:32px;background:var(--red);border-radius:8px;
  display:flex;align-items:center;justify-content:center;font-size:16px;
  animation:pulseMark 3s ease infinite;
}
@keyframes pulseMark{
  0%,100%{box-shadow:0 0 0 0 rgba(230,0,35,0.4);}
  50%{box-shadow:0 0 0 8px rgba(230,0,35,0);}
}

.nav-right{display:flex;align-items:center;gap:6px;}
.nav-link{
  color:var(--text2);text-decoration:none;font-size:14px;font-weight:400;
  padding:8px 14px;border-radius:8px;transition:all 0.2s;white-space:nowrap;
}
.nav-link:hover{color:var(--text);background:rgba(255,255,255,0.05);}
.nav-cta{
  background:var(--red);color:#fff;text-decoration:none;
  padding:9px 20px;border-radius:100px;font-size:13px;font-weight:600;
  transition:all 0.2s;display:flex;align-items:center;gap:6px;white-space:nowrap;
}
.nav-cta:hover{background:var(--red-dim);transform:scale(1.03);}

/* ── HERO ── */
.hero{
  min-height:calc(100vh - 68px);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:clamp(60px,8vh,100px) clamp(20px,5vw,48px) clamp(60px,8vh,80px);
  position:relative;
}
.hero-badge{
  display:inline-flex;align-items:center;gap:10px;
  background:rgba(230,0,35,0.07);border:1px solid rgba(230,0,35,0.16);
  color:var(--red);font-size:12px;font-weight:600;
  letter-spacing:1.5px;text-transform:uppercase;
  padding:8px 20px;border-radius:100px;margin-bottom:clamp(32px,5vh,52px);
  animation:fadeUp 0.7s 0.1s ease both;
}
.hero-badge-dot{
  width:6px;height:6px;background:var(--red);border-radius:50%;
  animation:blinkDot 1.8s ease infinite;
}
@keyframes blinkDot{0%,100%{opacity:1;}50%{opacity:0.3;}}

.hero-h1{
  font-family:'Syne',sans-serif;
  font-size:clamp(48px,10vw,112px);font-weight:800;
  line-height:0.92;letter-spacing:clamp(-2px,-0.04em,-4px);
  margin-bottom:clamp(24px,4vh,40px);
  animation:fadeUp 0.8s 0.2s ease both;
}
.hero-h1 .accent{color:var(--red);}
.hero-h1 .outline{-webkit-text-stroke:1.5px var(--text);color:transparent;}

.hero-sub{
  font-size:clamp(15px,2vw,18px);color:var(--text2);font-weight:300;
  max-width:460px;line-height:1.75;margin-bottom:clamp(36px,5vh,56px);
  animation:fadeUp 0.8s 0.35s ease both;
}
.hero-actions{
  display:flex;gap:12px;flex-wrap:wrap;justify-content:center;
  animation:fadeUp 0.8s 0.5s ease both;
}
.btn-primary{
  background:var(--red);color:#fff;text-decoration:none;
  padding:clamp(13px,2vh,16px) clamp(24px,3vw,36px);
  border-radius:100px;font-size:clamp(13px,1.5vw,15px);font-weight:600;
  display:inline-flex;align-items:center;gap:8px;transition:all 0.25s;
  white-space:nowrap;
}
.btn-primary:hover{background:var(--red-dim);transform:translateY(-3px);box-shadow:0 12px 40px rgba(230,0,35,0.3);}
.btn-outline{
  background:transparent;color:var(--text);text-decoration:none;
  padding:clamp(13px,2vh,16px) clamp(24px,3vw,36px);
  border-radius:100px;font-size:clamp(13px,1.5vw,15px);font-weight:500;
  border:1px solid var(--border-soft);display:inline-flex;align-items:center;gap:8px;transition:all 0.25s;
  white-space:nowrap;
}
.btn-outline:hover{border-color:rgba(255,255,255,0.25);transform:translateY(-3px);}

.scroll-hint{
  position:absolute;bottom:clamp(24px,4vh,44px);left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:8px;
  animation:fadeUp 1s 1s ease both;
}
.scroll-hint span{font-size:11px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;}
.scroll-line{
  width:1px;height:48px;background:linear-gradient(to bottom,var(--red),transparent);
  animation:scrollPulse 2s ease infinite;
}
@keyframes scrollPulse{
  0%{transform:scaleY(0);transform-origin:top;}
  50%{transform:scaleY(1);transform-origin:top;}
  51%{transform:scaleY(1);transform-origin:bottom;}
  100%{transform:scaleY(0);transform-origin:bottom;}
}
@keyframes fadeUp{from{transform:translateY(28px);opacity:0;}to{transform:translateY(0);opacity:1;}}

/* ── TICKER ── */
.ticker-wrap{
  overflow:hidden;width:100%;
  padding:18px 0;
  background:transparent;
}
.ticker-track{display:flex;width:max-content;animation:scrollTicker 28s linear infinite;}
.ticker-track:hover{animation-play-state:paused;}
.ticker-item{
  display:inline-flex;align-items:center;gap:16px;padding:0 36px;
  white-space:nowrap;font-size:11px;font-weight:600;letter-spacing:2.5px;
  text-transform:uppercase;color:var(--text3);
}
.ticker-dot{color:var(--red);font-size:12px;}
@keyframes scrollTicker{from{transform:translateX(0);}to{transform:translateX(-50%);}}

/* ── STATS ── */
.stats-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  padding:0 clamp(20px,5vw,64px);
  gap:0;
}
.stat-cell{
  padding:clamp(36px,5vh,64px) clamp(24px,3vw,48px);
  text-align:center;position:relative;overflow:hidden;
  transition:background 0.35s;
  border-radius:0;
}
.stat-cell::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(circle at 50% 100%,var(--red-glow),transparent 70%);
  opacity:0;transition:opacity 0.4s;
}
.stat-cell:hover{background:rgba(255,255,255,0.02);}
.stat-cell:hover::before{opacity:1;}
.stat-num{
  font-family:'Syne',sans-serif;
  font-size:clamp(40px,6vw,60px);font-weight:800;
  color:var(--red);letter-spacing:-3px;line-height:1;margin-bottom:10px;display:block;
}
.stat-label{font-size:13px;color:var(--text2);font-weight:400;line-height:1.4;}

/* ── SECTION ── */
.section{max-width:1280px;margin:0 auto;padding:clamp(72px,10vh,130px) clamp(20px,5vw,56px);}
.section-eyebrow{
  display:inline-flex;align-items:center;gap:12px;
  font-size:11px;font-weight:700;letter-spacing:3px;
  text-transform:uppercase;color:var(--red);margin-bottom:20px;
}
.section-eyebrow::before{content:'';width:24px;height:1px;background:var(--red);}
.section-title{
  font-family:'Syne',sans-serif;
  font-size:clamp(32px,4.5vw,60px);font-weight:800;
  letter-spacing:clamp(-1.5px,-0.03em,-2.5px);line-height:1.0;
  margin-bottom:clamp(48px,7vh,80px);
}

/* ── STEPS ── */
.steps-grid{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:16px;
}
.step-card{
  background:var(--bg2);padding:clamp(28px,4vw,48px) clamp(20px,3vw,36px);
  position:relative;overflow:hidden;transition:background 0.3s, transform 0.3s;
  border-radius:20px;
}
.step-card:hover{background:var(--bg3);transform:translateY(-4px);}
.step-card::after{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--red),rgba(230,0,35,0.3));
  transform:scaleX(0);transform-origin:left;
  transition:transform 0.4s ease;
  border-radius:2px 2px 0 0;
}
.step-card:hover::after{transform:scaleX(1);}
.step-num{
  font-family:'Syne',sans-serif;font-size:clamp(56px,7vw,84px);font-weight:800;
  color:rgba(230,0,35,0.06);line-height:1;margin-bottom:clamp(16px,2vh,28px);
  letter-spacing:-4px;transition:color 0.3s;display:block;
}
.step-card:hover .step-num{color:rgba(230,0,35,0.12);}
.step-emoji{font-size:28px;margin-bottom:14px;display:block;}
.step-name{font-family:'Syne',sans-serif;font-size:clamp(15px,1.8vw,19px);font-weight:700;margin-bottom:10px;}
.step-body{font-size:13px;color:var(--text2);line-height:1.65;font-weight:300;}

/* ── FEATURES ── */
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.feat-card{
  background:var(--bg2);border-radius:20px;
  padding:clamp(28px,3.5vw,44px);transition:all 0.3s;position:relative;overflow:hidden;
}
.feat-card::before{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(230,0,35,0.5),transparent);
  transform:scaleX(0);transition:transform 0.4s;
}
.feat-card:hover{
  transform:translateY(-6px);
  background:var(--bg3);box-shadow:0 20px 50px rgba(0,0,0,0.35);
}
.feat-card:hover::before{transform:scaleX(1);}
.feat-icon-wrap{
  width:50px;height:50px;
  background:rgba(230,0,35,0.07);
  border-radius:14px;display:flex;align-items:center;justify-content:center;
  font-size:22px;margin-bottom:22px;transition:all 0.3s;
}
.feat-card:hover .feat-icon-wrap{background:rgba(230,0,35,0.14);}
.feat-name{font-family:'Syne',sans-serif;font-size:clamp(15px,1.6vw,18px);font-weight:700;margin-bottom:10px;}
.feat-body{font-size:13px;color:var(--text2);line-height:1.7;font-weight:300;}

/* ── DEMO / TERMINAL ── */
.demo-section{
  padding:clamp(72px,10vh,130px) clamp(20px,5vw,56px);
}
.demo-inner{max-width:1280px;margin:0 auto;}
.demo-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,5vw,72px);align-items:center;margin-top:clamp(40px,6vh,72px);}

.demo-terminal{
  background:var(--bg2);
  border-radius:20px;overflow:hidden;
  box-shadow:0 32px 80px rgba(0,0,0,0.45);
}
.terminal-bar{
  background:var(--bg3);padding:14px 20px;
  display:flex;align-items:center;gap:8px;
}
.t-dot{width:12px;height:12px;border-radius:50%;}
.t-dot-r{background:#ff5f57;} .t-dot-y{background:#ffbd2e;} .t-dot-g{background:#28ca41;}
.terminal-title{font-size:12px;color:var(--text3);margin-left:8px;font-family:monospace;}
.terminal-body{padding:clamp(18px,2.5vw,28px);font-family:'Courier New',monospace;font-size:clamp(11px,1.2vw,13px);line-height:2;overflow-x:auto;}
.t-dim{color:var(--text3);} .t-green{color:#69db7c;} .t-yellow{color:#ffd43b;}
.t-blue{color:#74c0fc;} .t-white{color:var(--text);}
.t-cursor{
  display:inline-block;width:8px;height:14px;background:var(--red);
  margin-left:2px;animation:blinkDot 1s step-end infinite;vertical-align:middle;
}

.demo-steps-list{display:flex;flex-direction:column;gap:14px;}
.demo-step-item{
  display:flex;align-items:flex-start;gap:16px;padding:clamp(18px,2.5vw,26px);
  background:var(--bg2);border-radius:16px;
  transition:all 0.3s;
}
.demo-step-item:hover{background:var(--bg3);}
.demo-step-num{
  width:36px;height:36px;background:var(--red);border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-family:'Syne',sans-serif;font-size:14px;font-weight:800;
  flex-shrink:0;color:#fff;
}
.demo-step-text h4{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;margin-bottom:5px;}
.demo-step-text p{font-size:13px;color:var(--text2);line-height:1.55;font-weight:300;}

/* ── FAQ ── */
.faq-list{display:flex;flex-direction:column;gap:8px;}
.faq-item{
  border-radius:16px;overflow:hidden;
  background:var(--bg2);transition:background 0.3s;
}
.faq-item:hover{background:var(--bg3);}
.faq-q{
  width:100%;background:none;border:none;color:var(--text);
  padding:clamp(18px,2.5vw,24px) clamp(20px,3vw,28px);
  text-align:left;cursor:pointer;
  display:flex;justify-content:space-between;align-items:center;gap:16px;
  font-family:'Syne',sans-serif;font-size:clamp(14px,1.6vw,16px);font-weight:700;
  transition:color 0.2s;
}
.faq-q:hover{color:var(--red);}
.faq-icon{
  width:28px;height:28px;background:rgba(230,0,35,0.08);
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:16px;transition:all 0.3s;flex-shrink:0;color:var(--red);
  font-style:normal;font-family:monospace;
}
.faq-item.open .faq-icon{background:var(--red);color:#fff;transform:rotate(45deg);}
.faq-a{
  max-height:0;overflow:hidden;transition:max-height 0.4s ease,padding 0.3s;
  padding:0 clamp(20px,3vw,28px);
}
.faq-item.open .faq-a{max-height:200px;padding:0 clamp(20px,3vw,28px) clamp(18px,2.5vw,24px);}
.faq-a p{font-size:14px;color:var(--text2);line-height:1.7;font-weight:300;}

/* ── CTA ── */
.cta-wrap{padding:0 clamp(20px,5vw,56px) clamp(72px,10vh,120px);max-width:1280px;margin:0 auto;}
.cta-card{
  background:var(--bg2);
  border-radius:32px;padding:clamp(60px,10vh,110px) clamp(28px,6vw,70px);text-align:center;
  position:relative;overflow:hidden;
}
.cta-card::before{
  content:'';position:absolute;top:-120px;left:50%;transform:translateX(-50%);
  width:600px;height:600px;
  background:radial-gradient(circle,rgba(230,0,35,0.08),transparent 70%);
  pointer-events:none;
}
.cta-card h2{
  font-family:'Syne',sans-serif;
  font-size:clamp(32px,5.5vw,68px);font-weight:800;
  letter-spacing:clamp(-1.5px,-0.03em,-3px);margin-bottom:20px;line-height:1.0;
}
.cta-card p{
  font-size:clamp(15px,1.8vw,18px);color:var(--text2);max-width:420px;
  margin:0 auto clamp(36px,5vh,56px);line-height:1.65;font-weight:300;
}
.cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}

/* ── FOOTER ── */
footer{
  padding:clamp(28px,4vh,48px) clamp(20px,5vw,64px);
  display:flex;justify-content:space-between;align-items:center;gap:20px;
}
.footer-logo{
  font-family:'Syne',sans-serif;font-weight:800;font-size:18px;
  display:flex;align-items:center;gap:8px;color:var(--text2);text-decoration:none;flex-shrink:0;
}
.footer-mark{
  width:24px;height:24px;background:var(--red);border-radius:6px;
  display:flex;align-items:center;justify-content:center;font-size:12px;
}
.footer-links{display:flex;gap:clamp(16px,2.5vw,28px);flex-wrap:wrap;justify-content:center;}
.footer-links a{font-size:13px;color:var(--text3);text-decoration:none;transition:color 0.2s;}
.footer-links a:hover{color:var(--text);}
.footer-copy{font-size:13px;color:var(--text3);white-space:nowrap;}
.footer-copy a{color:var(--red);text-decoration:none;}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  .steps-grid{grid-template-columns:repeat(2,1fr);}
  .feat-grid{grid-template-columns:repeat(2,1fr);}
  .stats-grid{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:820px){
  .demo-grid{grid-template-columns:1fr;gap:32px;}
  .feat-grid{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:680px){
  nav .nav-link{display:none;}
  .hero-h1{letter-spacing:-1.5px;}
  .feat-grid{grid-template-columns:1fr;}
  .steps-grid{grid-template-columns:1fr;}
  .stats-grid{grid-template-columns:repeat(2,1fr);}
  .cta-card{border-radius:20px;}
  footer{flex-direction:column;text-align:center;}
  .footer-links{gap:14px;}
  .hero-actions{flex-direction:column;align-items:center;}
  .hero-actions .btn-primary,
  .hero-actions .btn-outline{width:100%;max-width:300px;justify-content:center;}
}
@media(max-width:400px){
  .stats-grid{grid-template-columns:1fr;}
  .stat-cell{padding:32px 20px;}
}
</style>
</head>
<body>

<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>

<div class="page">

<!-- NAV -->
<nav id="main-nav">
  <a href="/" class="logo">
    <div class="logo-mark">📌</div>
    PinBot
  </a>
  <div class="nav-right">
    <a href="#how" class="nav-link">How it works</a>
    <a href="#features" class="nav-link">Features</a>
    <a href="#faq" class="nav-link">FAQ</a>
    <a href="/privacy" class="nav-link">Privacy</a>
    <a href="https://t.me/Pinterest_pins_bot" target="_blank" class="nav-cta">✈️ Open Bot</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-badge">
    <span class="hero-badge-dot"></span>
    Live · Powered by Gemini 2.5 Flash
  </div>
  <h1 class="hero-h1">
    <span class="outline">Amazon</span><br/>
    to <span class="accent">Pinterest</span><br/>
    Automated.
  </h1>
  <p class="hero-sub">
    Paste Amazon product links into Telegram. Get SEO-optimized Pinterest pins posted to your board and channel — instantly.
  </p>
  <div class="hero-actions">
    <a href="https://t.me/Pinterest_pins_bot" target="_blank" class="btn-primary">✈️ Open Telegram Bot</a>
    <a href="#how" class="btn-outline">See how it works →</a>
  </div>
  <div class="scroll-hint">
    <span>Scroll</span>
    <div class="scroll-line"></div>
  </div>
</section>

<!-- TICKER -->
<div class="ticker-wrap">
  <div class="ticker-track">
    <span class="ticker-item">Amazon Scraping <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">AI Pin Writing <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Telegram Channel <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Pinterest Auto-Post <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Bulk Processing <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">SEO Keywords <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Gemini 2.5 Flash <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Scrapingdog API <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Amazon Scraping <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">AI Pin Writing <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Telegram Channel <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Pinterest Auto-Post <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Bulk Processing <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">SEO Keywords <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Gemini 2.5 Flash <span class="ticker-dot">✦</span></span>
    <span class="ticker-item">Scrapingdog API <span class="ticker-dot">✦</span></span>
  </div>
</div>

<!-- STATS -->
<div class="stats-grid">
  <div class="stat-cell">
    <span class="stat-num">10x</span>
    <div class="stat-label">Faster than manual pinning</div>
  </div>
  <div class="stat-cell">
    <span class="stat-num">10</span>
    <div class="stat-label">Products processed at once</div>
  </div>
  <div class="stat-cell">
    <span class="stat-num">100%</span>
    <div class="stat-label">SEO optimized every pin</div>
  </div>
  <div class="stat-cell">
    <span class="stat-num">Free</span>
    <div class="stat-label">No subscription needed</div>
  </div>
</div>

<!-- HOW IT WORKS -->
<div class="section" id="how">
  <div class="section-eyebrow">Process</div>
  <h2 class="section-title">Four steps.<br/>Zero effort.</h2>
  <div class="steps-grid">
    <div class="step-card">
      <span class="step-num">01</span>
      <span class="step-emoji">🔗</span>
      <div class="step-name">Send your links</div>
      <p class="step-body">Open the Telegram bot and paste 1–10 Amazon product URLs — one per line. Works with amazon.in, amazon.com, and amzn.to short links.</p>
    </div>
    <div class="step-card">
      <span class="step-num">02</span>
      <span class="step-emoji">🛒</span>
      <div class="step-name">Bot scrapes Amazon</div>
      <p class="step-body">Scrapingdog API extracts the product title, price, high-res images, feature bullets, rating and review count from every URL automatically.</p>
    </div>
    <div class="step-card">
      <span class="step-num">03</span>
      <span class="step-emoji">🤖</span>
      <div class="step-name">AI writes the pin</div>
      <p class="step-body">Gemini 2.5 Flash generates a catchy title, SEO-rich description with bullet features, and 12 category-specific Pinterest hashtags per product.</p>
    </div>
    <div class="step-card">
      <span class="step-num">04</span>
      <span class="step-emoji">📌</span>
      <div class="step-name">Auto-posted everywhere</div>
      <p class="step-body">Each pin is posted to your Telegram channel with product image, and published to your Pinterest board via the official Pinterest API v5.</p>
    </div>
  </div>
</div>

<!-- FEATURES -->
<div class="section" id="features" style="padding-top:0">
  <div class="section-eyebrow">Features</div>
  <h2 class="section-title">Everything<br/>built in.</h2>
  <div class="feat-grid">
    <div class="feat-card">
      <div class="feat-icon-wrap">🛒</div>
      <div class="feat-name">Amazon scraping</div>
      <p class="feat-body">Powered by Scrapingdog API — extracts clean structured product data including title, price, images, bullet features and ratings from any Amazon URL without being blocked.</p>
    </div>
    <div class="feat-card">
      <div class="feat-icon-wrap">🤖</div>
      <div class="feat-name">AI pin writing</div>
      <p class="feat-body">Gemini 2.5 Flash generates benefit-focused Pinterest titles under 80 chars, 150–200 char descriptions with bullet points, and 12 relevant hashtags per product.</p>
    </div>
    <div class="feat-card">
      <div class="feat-icon-wrap">📢</div>
      <div class="feat-name">Telegram channel</div>
      <p class="feat-body">Product image and full pin content are automatically posted as a formatted message to your Telegram channel — no copy-paste required ever.</p>
    </div>
    <div class="feat-card">
      <div class="feat-icon-wrap">📌</div>
      <div class="feat-name">Pinterest auto-post</div>
      <p class="feat-body">Pins published directly to your Pinterest board via official Pinterest API v5 with OAuth 2.0 authentication and automatic token refresh every 30 days.</p>
    </div>
    <div class="feat-card">
      <div class="feat-icon-wrap">📦</div>
      <div class="feat-name">Bulk processing</div>
      <p class="feat-body">Send up to 10 Amazon links in a single message. The bot processes them sequentially — scraping, generating and posting each one with live progress updates.</p>
    </div>
    <div class="feat-card">
      <div class="feat-icon-wrap">🔍</div>
      <div class="feat-name">SEO keyword engine</div>
      <p class="feat-body">Category-aware keyword database detects product type — earbuds, skincare, fashion, kitchen — and injects primary, niche, India-specific and buying-intent keywords.</p>
    </div>
  </div>
</div>

<!-- DEMO / TERMINAL -->
<div class="demo-section" id="demo">
  <div class="demo-inner">
    <div class="section-eyebrow">In action</div>
    <h2 class="section-title">See it work<br/>in real time.</h2>
    <div class="demo-grid">
      <div class="demo-terminal">
        <div class="terminal-bar">
          <div class="t-dot t-dot-r"></div>
          <div class="t-dot t-dot-y"></div>
          <div class="t-dot t-dot-g"></div>
          <span class="terminal-title">PinBot · Telegram</span>
        </div>
        <div class="terminal-body">
          <div><span class="t-dim">You  → </span><span class="t-white">https://www.amazon.in/dp/B0BJ194Z43</span></div>
          <div><span class="t-dim">You  → </span><span class="t-white">https://amzn.to/4rxL63G</span></div>
          <br/>
          <div><span class="t-yellow">📦 Found 2 products. Starting...</span></div>
          <br/>
          <div><span class="t-blue">🔍 Processing 1/2...</span></div>
          <div><span class="t-dim">&nbsp;&nbsp;&nbsp;Scrapingdog → data extracted ✓</span></div>
          <div><span class="t-dim">&nbsp;&nbsp;&nbsp;Gemini 2.5  → pin generated ✓</span></div>
          <div><span class="t-green">✅ Posted 1/2 · boAt Airdopes 141</span></div>
          <br/>
          <div><span class="t-blue">🔍 Processing 2/2...</span></div>
          <div><span class="t-dim">&nbsp;&nbsp;&nbsp;Scrapingdog → data extracted ✓</span></div>
          <div><span class="t-dim">&nbsp;&nbsp;&nbsp;Gemini 2.5  → pin generated ✓</span></div>
          <div><span class="t-green">✅ Posted 2/2 · Nike Deodorant Trio</span></div>
          <br/>
          <div><span class="t-yellow">🎉 Done! Posted 2/2 pins to:</span></div>
          <div><span class="t-dim">&nbsp;&nbsp;&nbsp;→ Telegram channel ✓</span></div>
          <div><span class="t-dim">&nbsp;&nbsp;&nbsp;→ Pinterest board  ✓</span></div>
          <br/>
          <div><span class="t-dim">$ </span><span class="t-cursor"></span></div>
        </div>
      </div>

      <div class="demo-steps-list">
        <div class="demo-step-item">
          <div class="demo-step-num">1</div>
          <div class="demo-step-text">
            <h4>Open the bot in Telegram</h4>
            <p>Search @Pinterest_Bot in Telegram and send /start. No sign-up, no account, no credit card needed.</p>
          </div>
        </div>
        <div class="demo-step-item">
          <div class="demo-step-num">2</div>
          <div class="demo-step-text">
            <h4>Paste your Amazon links</h4>
            <p>Send 1–10 Amazon product URLs in one message — one per line. Any format works including amzn.to short links.</p>
          </div>
        </div>
        <div class="demo-step-item">
          <div class="demo-step-num">3</div>
          <div class="demo-step-text">
            <h4>Watch the bot work live</h4>
            <p>The bot shows real-time progress as it scrapes each product and generates the Pinterest pin using Gemini 2.5 Flash.</p>
          </div>
        </div>
        <div class="demo-step-item">
          <div class="demo-step-num">4</div>
          <div class="demo-step-text">
            <h4>Pins go live automatically</h4>
            <p>Each pin is posted to your Telegram channel and Pinterest board. You receive a confirmation with the live Pinterest link.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- FAQ -->
<div class="section" id="faq">
  <div class="section-eyebrow">FAQ</div>
  <h2 class="section-title">Common<br/>questions.</h2>
  <div class="faq-list">
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFaq(this)">
        What Amazon URLs does this support?
        <i class="faq-icon">+</i>
      </button>
      <div class="faq-a">
        <p>PinBot supports all Amazon country domains including amazon.in, amazon.com, amazon.co.uk, amazon.de, amazon.ca, and amzn.to short links. Just paste the product page URL directly.</p>
      </div>
    </div>
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFaq(this)">
        How many links can I send at once?
        <i class="faq-icon">+</i>
      </button>
      <div class="faq-a">
        <p>You can send up to 10 Amazon product links in a single message. For more products, send them in batches of 10. The bot processes each link sequentially with a 2-second delay to avoid API rate limits.</p>
      </div>
    </div>
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFaq(this)">
        Does it post to Pinterest automatically?
        <i class="faq-icon">+</i>
      </button>
      <div class="faq-a">
        <p>Yes — once you connect your Pinterest account via OAuth, every pin is published directly to your chosen Pinterest board without any manual action. The Pinterest access token auto-refreshes every 30 days.</p>
      </div>
    </div>
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFaq(this)">
        What does the generated pin include?
        <i class="faq-icon">+</i>
      </button>
      <div class="faq-a">
        <p>Each pin includes: a catchy SEO-optimized title (under 80 chars), a 150–200 character description with bullet-point features and price, the product image, the Amazon affiliate link, and 12 category-specific hashtags.</p>
      </div>
    </div>
    <div class="faq-item">
      <button class="faq-q" onclick="toggleFaq(this)">
        Is this free to use?
        <i class="faq-icon">+</i>
      </button>
      <div class="faq-a">
        <p>PinBot itself is free. It uses Scrapingdog (1000 free credits/month), Google Gemini API (generous free tier), and Pinterest API (free). You only need to bring your own API keys from these services.</p>
      </div>
    </div>
  </div>
</div>

<!-- CTA -->
<div class="cta-wrap">
  <div class="cta-card">
    <h2>Start automating<br/>your Pinterest.</h2>
    <p>Open the bot, paste your first Amazon link, and watch the pin go live in seconds.</p>
    <div class="cta-btns">
      <a href="https://t.me/Pinterest_pins_bot" target="_blank" class="btn-primary">✈️ Open Telegram Bot</a>
      <a href="https://github.com/keerthi-gopi/pinterestbot" target="_blank" class="btn-outline">View on GitHub →</a>
    </div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <a href="/" class="footer-logo">
    <div class="footer-mark">📌</div>
    PinBot
  </a>
  <div class="footer-links">
    <a href="#how">How it works</a>
    <a href="#features">Features</a>
    <a href="#faq">FAQ</a>
    <a href="/privacy">Privacy Policy</a>
    <a href="https://t.me/Pinterest_pins_bot" target="_blank">Telegram</a>
    <a href="https://github.com/keerthi-gopi/pinterestbot" target="_blank">GitHub</a>
  </div>
  <div class="footer-copy">© 2026 Built by <a href="https://github.com/keerthi-gopi" target="_blank">Keerthi Gopi</a></div>
</footer>

</div>

<script>
// FAQ toggle
function toggleFaq(btn) {
  var item = btn.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

// Nav border on scroll
window.addEventListener('scroll', function(){
  var nav = document.getElementById('main-nav');
  if(window.scrollY > 20){
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
    nav.style.background = '';
  }
}, {passive:true});

// Scroll reveal
(function(){
  var style = document.createElement('style');
  style.textContent = '.sr{opacity:0;transform:translateY(24px);transition:opacity 0.6s ease,transform 0.6s ease;}.sr.in{opacity:1;transform:translateY(0);}';
  document.head.appendChild(style);

  var els = document.querySelectorAll(
    '.stat-cell,.step-card,.feat-card,.demo-step-item,.faq-item,.cta-card,.section-eyebrow,.section-title,.demo-terminal'
  );

  els.forEach(function(el, i){
    el.classList.add('sr');
    el.style.transitionDelay = (i % 4) * 0.07 + 's';
  });

  function reveal() {
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < window.innerHeight - 60){
        el.classList.add('in');
      }
    });
  }

  window.addEventListener('scroll', reveal, {passive:true});
  window.addEventListener('resize', reveal);
  setTimeout(reveal, 100);
  setTimeout(function(){
    els.forEach(function(el){ el.classList.add('in'); });
  }, 2500);
})();

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var t = document.querySelector(this.getAttribute('href'));
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});
</script>
</body>
</html>`);
}