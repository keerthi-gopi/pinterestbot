// api/index.js
export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>PinBot — Amazon to Pinterest, Automated</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet"/>
<style>
:root {
  --red: #e60023;
  --red-dim: #9e0018;
  --bg: #080808;
  --bg2: #0f0f0f;
  --bg3: #141414;
  --border: rgba(255,255,255,0.07);
  --border-hover: rgba(230,0,35,0.4);
  --text: #f0ede8;
  --muted: #6b6866;
  --muted2: #3a3836;
}
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── Noise texture overlay ── */
body::before {
  content:'';
  position:fixed;
  inset:0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events:none;
  z-index:0;
  opacity:0.4;
}

/* ── Animated gradient orbs ── */
.orb {
  position:fixed;
  border-radius:50%;
  filter:blur(120px);
  pointer-events:none;
  z-index:0;
  opacity:0.15;
  animation: drift 20s ease-in-out infinite alternate;
}
.orb-1 { width:600px; height:600px; background:var(--red); top:-200px; left:-100px; animation-delay:0s; }
.orb-2 { width:400px; height:400px; background:#ff6b35; bottom:-100px; right:-100px; animation-delay:-8s; }
.orb-3 { width:300px; height:300px; background:#c2006e; top:50%; left:50%; animation-delay:-4s; }

@keyframes drift {
  from { transform: translate(0,0) scale(1); }
  to { transform: translate(40px, 30px) scale(1.1); }
}

/* ── Layout ── */
.wrap { position:relative; z-index:1; }

/* ── Nav ── */
nav {
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:24px 60px;
  position:sticky;
  top:0;
  z-index:100;
  backdrop-filter: blur(20px);
  background: rgba(8,8,8,0.8);
  border-bottom: 1px solid var(--border);
  animation: slideDown 0.6s ease both;
}
@keyframes slideDown {
  from { transform:translateY(-100%); opacity:0; }
  to { transform:translateY(0); opacity:1; }
}
.logo {
  font-family:'Syne',sans-serif;
  font-weight:800;
  font-size:24px;
  letter-spacing:-0.5px;
  display:flex;
  align-items:center;
  gap:8px;
}
.logo-dot {
  width:8px; height:8px;
  background:var(--red);
  border-radius:50%;
  animation: pulse 2s ease infinite;
}
@keyframes pulse {
  0%,100% { transform:scale(1); opacity:1; }
  50% { transform:scale(1.5); opacity:0.6; }
}
.nav-links { display:flex; align-items:center; gap:32px; }
.nav-links a {
  color:var(--muted);
  text-decoration:none;
  font-size:14px;
  font-weight:500;
  transition:color 0.2s;
}
.nav-links a:hover { color:var(--text); }
.nav-cta {
  background: var(--red);
  color:#fff !important;
  padding:10px 22px;
  border-radius:100px;
  font-size:13px !important;
  font-weight:600 !important;
  transition: background 0.2s, transform 0.2s !important;
}
.nav-cta:hover { background:var(--red-dim) !important; transform:scale(1.03) !important; }

/* ── Hero ── */
.hero {
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding:80px 24px;
}
.hero-eyebrow {
  display:inline-flex;
  align-items:center;
  gap:8px;
  background:rgba(230,0,35,0.08);
  border:1px solid rgba(230,0,35,0.2);
  color:var(--red);
  font-size:12px;
  font-weight:600;
  letter-spacing:2px;
  text-transform:uppercase;
  padding:8px 18px;
  border-radius:100px;
  margin-bottom:40px;
  animation: fadeUp 0.8s 0.2s ease both;
}
.hero-eyebrow span {
  width:6px; height:6px;
  background:var(--red);
  border-radius:50%;
  animation: pulse 1.5s ease infinite;
}
h1 {
  font-family:'Syne',sans-serif;
  font-size:clamp(48px, 8vw, 96px);
  font-weight:800;
  line-height:0.95;
  letter-spacing:-3px;
  margin-bottom:32px;
  animation: fadeUp 0.8s 0.3s ease both;
}
h1 .line { display:block; overflow:hidden; }
h1 .word {
  display:inline-block;
  animation: wordUp 0.7s ease both;
}
h1 .word:nth-child(1) { animation-delay: 0.3s; }
h1 .word:nth-child(2) { animation-delay: 0.4s; }
h1 .word:nth-child(3) { animation-delay: 0.5s; }
h1 em {
  font-style:italic;
  color:var(--red);
  -webkit-text-stroke: 0px;
}
h1 .outline {
  -webkit-text-stroke: 1.5px var(--text);
  color:transparent;
}
@keyframes wordUp {
  from { transform:translateY(100%); opacity:0; }
  to { transform:translateY(0); opacity:1; }
}
@keyframes fadeUp {
  from { transform:translateY(24px); opacity:0; }
  to { transform:translateY(0); opacity:1; }
}
.hero-sub {
  font-size:18px;
  color:var(--muted);
  max-width:480px;
  line-height:1.7;
  margin-bottom:48px;
  font-weight:300;
  animation: fadeUp 0.8s 0.6s ease both;
}
.hero-btns {
  display:flex;
  gap:12px;
  animation: fadeUp 0.8s 0.7s ease both;
}
.btn-red {
  background:var(--red);
  color:#fff;
  padding:16px 36px;
  border-radius:100px;
  font-size:15px;
  font-weight:600;
  text-decoration:none;
  display:inline-flex;
  align-items:center;
  gap:8px;
  transition:background 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow:0 0 0 0 rgba(230,0,35,0);
}
.btn-red:hover {
  background:var(--red-dim);
  transform:translateY(-2px);
  box-shadow:0 8px 32px rgba(230,0,35,0.3);
}
.btn-ghost {
  background:transparent;
  color:var(--text);
  padding:16px 36px;
  border-radius:100px;
  font-size:15px;
  font-weight:500;
  text-decoration:none;
  border:1px solid var(--border);
  transition:border-color 0.2s, transform 0.2s;
}
.btn-ghost:hover { border-color:rgba(255,255,255,0.3); transform:translateY(-2px); }

/* ── Scrolling ticker ── */
.ticker-wrap {
  width:100%;
  overflow:hidden;
  border-top:1px solid var(--border);
  border-bottom:1px solid var(--border);
  padding:16px 0;
  margin:0;
  background: rgba(255,255,255,0.02);
}
.ticker {
  display:flex;
  gap:0;
  animation: ticker 20s linear infinite;
  white-space:nowrap;
}
.ticker-item {
  display:inline-flex;
  align-items:center;
  gap:12px;
  padding:0 32px;
  font-size:13px;
  color:var(--muted);
  font-weight:500;
  letter-spacing:1px;
  text-transform:uppercase;
}
.ticker-sep { color:var(--red); font-size:18px; }
@keyframes ticker {
  from { transform:translateX(0); }
  to { transform:translateX(-50%); }
}

/* ── Stats ── */
.stats-row {
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1px;
  background:var(--border);
  border-top:1px solid var(--border);
  border-bottom:1px solid var(--border);
}
.stat-cell {
  background:var(--bg);
  padding:48px 32px;
  text-align:center;
  transition:background 0.3s;
}
.stat-cell:hover { background:var(--bg3); }
.stat-num {
  font-family:'Syne',sans-serif;
  font-size:52px;
  font-weight:800;
  color:var(--red);
  letter-spacing:-2px;
  line-height:1;
  margin-bottom:8px;
}
.stat-label { font-size:13px; color:var(--muted); font-weight:400; }

/* ── Section ── */
.section { max-width:1200px; margin:0 auto; padding:120px 40px; }
.section-tag {
  display:inline-flex;
  align-items:center;
  gap:8px;
  font-size:11px;
  font-weight:700;
  letter-spacing:3px;
  text-transform:uppercase;
  color:var(--red);
  margin-bottom:20px;
}
.section-tag::before {
  content:'';
  width:24px; height:1px;
  background:var(--red);
}
.section-h {
  font-family:'Syne',sans-serif;
  font-size:clamp(32px,4vw,52px);
  font-weight:800;
  letter-spacing:-2px;
  margin-bottom:64px;
  line-height:1.05;
}

/* ── Steps ── */
.steps-grid {
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1px;
  background:var(--border);
  border:1px solid var(--border);
  border-radius:24px;
  overflow:hidden;
}
.step-card {
  background:var(--bg2);
  padding:40px 32px;
  transition:background 0.3s;
  position:relative;
  overflow:hidden;
}
.step-card::before {
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(135deg,rgba(230,0,35,0.05),transparent);
  opacity:0;
  transition:opacity 0.3s;
}
.step-card:hover { background:var(--bg3); }
.step-card:hover::before { opacity:1; }
.step-n {
  font-family:'Syne',sans-serif;
  font-size:72px;
  font-weight:800;
  color:rgba(230,0,35,0.08);
  line-height:1;
  margin-bottom:24px;
  letter-spacing:-3px;
  transition:color 0.3s;
}
.step-card:hover .step-n { color:rgba(230,0,35,0.15); }
.step-icon { font-size:28px; margin-bottom:16px; }
.step-title {
  font-family:'Syne',sans-serif;
  font-size:18px;
  font-weight:700;
  margin-bottom:10px;
}
.step-desc { font-size:14px; color:var(--muted); line-height:1.6; font-weight:300; }

/* ── Feature grid ── */
.feat-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
}
.feat-card {
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:20px;
  padding:36px;
  transition:border-color 0.3s, transform 0.3s, background 0.3s;
  position:relative;
  overflow:hidden;
}
.feat-card::after {
  content:'';
  position:absolute;
  bottom:0; left:0; right:0;
  height:2px;
  background:var(--red);
  transform:scaleX(0);
  transition:transform 0.3s;
  transform-origin:left;
}
.feat-card:hover {
  border-color:var(--border-hover);
  transform:translateY(-4px);
  background:var(--bg3);
}
.feat-card:hover::after { transform:scaleX(1); }
.feat-icon {
  width:48px; height:48px;
  background:rgba(230,0,35,0.1);
  border:1px solid rgba(230,0,35,0.2);
  border-radius:12px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:22px;
  margin-bottom:20px;
}
.feat-title {
  font-family:'Syne',sans-serif;
  font-size:17px;
  font-weight:700;
  margin-bottom:10px;
}
.feat-desc { font-size:14px; color:var(--muted); line-height:1.65; font-weight:300; }

/* ── CTA ── */
.cta-section {
  margin:0 40px 120px;
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:32px;
  padding:100px 60px;
  text-align:center;
  position:relative;
  overflow:hidden;
}
.cta-section::before {
  content:'';
  position:absolute;
  top:-100px; left:50%;
  transform:translateX(-50%);
  width:400px; height:400px;
  background:var(--red);
  border-radius:50%;
  filter:blur(120px);
  opacity:0.08;
  pointer-events:none;
}
.cta-section h2 {
  font-family:'Syne',sans-serif;
  font-size:clamp(32px,4vw,56px);
  font-weight:800;
  letter-spacing:-2px;
  margin-bottom:16px;
}
.cta-section p { color:var(--muted); font-size:17px; margin-bottom:48px; font-weight:300; }
.cta-btn-wrap { display:flex; gap:12px; justify-content:center; }

/* ── Footer ── */
footer {
  border-top:1px solid var(--border);
  padding:40px 60px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  font-size:13px;
  color:var(--muted);
}
footer a { color:var(--muted); text-decoration:none; transition:color 0.2s; }
footer a:hover { color:var(--text); }
.footer-links { display:flex; gap:24px; }

/* ── Scroll reveal ── */
.reveal {
  opacity:0;
  transform:translateY(32px);
  transition:opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
  opacity:1;
  transform:translateY(0);
}

/* ── Responsive ── */
@media(max-width:900px) {
  nav { padding:20px 24px; }
  .nav-links { display:none; }
  .stats-row { grid-template-columns:repeat(2,1fr); }
  .steps-grid { grid-template-columns:repeat(2,1fr); }
  .feat-grid { grid-template-columns:1fr; }
  .section { padding:80px 24px; }
  .cta-section { margin:0 16px 80px; padding:60px 24px; }
  footer { flex-direction:column; gap:16px; padding:32px 24px; }
}
</style>
</head>
<body>

<div class="orb orb-1"></div>
<div class="orb orb-2"></div>
<div class="orb orb-3"></div>

<div class="wrap">

<!-- Nav -->
<nav>
  <div class="logo">
    <div class="logo-dot"></div>
    PinBot
  </div>
  <div class="nav-links">
    <a href="#how">How it works</a>
    <a href="#features">Features</a>
    <a href="/privacy">Privacy</a>
    <a href="https://t.me/Pinterest_pins_bot" target="_blank" class="nav-cta">Open Bot ↗</a>
  </div>
</nav>

<!-- Hero -->
<section class="hero">
  <div class="hero-eyebrow">
    <span></span>
    Live · Powered by Gemini 2.5 Flash
  </div>
  <h1>
    <span class="line"><span class="word">Turn</span> <span class="word outline">Amazon</span></span>
    <span class="line"><span class="word">into</span> <span class="word"><em>Pinterest</em></span></span>
    <span class="line"><span class="word outline">Instantly</span></span>
  </h1>
  <p class="hero-sub">Paste product links. Get SEO-optimized pins posted to your Telegram channel and Pinterest board — automatically.</p>
  <div class="hero-btns">
    <a href="https://t.me/Pinterest_pins_bot" target="_blank" class="btn-red">✈️ Open Telegram Bot</a>
    <a href="#how" class="btn-ghost">See how it works →</a>
  </div>
</section>

<!-- Ticker -->
<div class="ticker-wrap">
  <div class="ticker">
    <span class="ticker-item">Amazon Scraping <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">AI Pin Writing <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">Telegram Channel <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">Pinterest Auto-Post <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">Bulk Processing <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">SEO Keywords <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">Amazon Scraping <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">AI Pin Writing <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">Telegram Channel <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">Pinterest Auto-Post <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">Bulk Processing <span class="ticker-sep">✦</span></span>
    <span class="ticker-item">SEO Keywords <span class="ticker-sep">✦</span></span>
  </div>
</div>

<!-- Stats -->
<div class="stats-row reveal">
  <div class="stat-cell"><div class="stat-num">10x</div><div class="stat-label">Faster than manual</div></div>
  <div class="stat-cell"><div class="stat-num">10</div><div class="stat-label">Products at once</div></div>
  <div class="stat-cell"><div class="stat-num">100%</div><div class="stat-label">SEO optimized</div></div>
  <div class="stat-cell"><div class="stat-num">Free</div><div class="stat-label">No subscription</div></div>
</div>

<!-- How it works -->
<div class="section" id="how">
  <div class="section-tag reveal">Process</div>
  <h2 class="section-h reveal">Four steps.<br/>Zero effort.</h2>
  <div class="steps-grid reveal">
    <div class="step-card">
      <div class="step-n">01</div>
      <div class="step-icon">🔗</div>
      <div class="step-title">Send links</div>
      <p class="step-desc">Paste 1–10 Amazon product URLs in the Telegram bot — one per line.</p>
    </div>
    <div class="step-card">
      <div class="step-n">02</div>
      <div class="step-icon">🛒</div>
      <div class="step-title">Auto scrape</div>
      <p class="step-desc">Bot extracts title, price, images and features from every Amazon page.</p>
    </div>
    <div class="step-card">
      <div class="step-n">03</div>
      <div class="step-icon">🤖</div>
      <div class="step-title">AI generates</div>
      <p class="step-desc">Gemini 2.5 Flash writes SEO-optimized titles, descriptions and hashtags.</p>
    </div>
    <div class="step-card">
      <div class="step-n">04</div>
      <div class="step-icon">📌</div>
      <div class="step-title">Auto post</div>
      <p class="step-desc">Each pin goes live on Telegram channel and Pinterest board automatically.</p>
    </div>
  </div>
</div>

<!-- Features -->
<div class="section" id="features" style="padding-top:0">
  <div class="section-tag reveal">Features</div>
  <h2 class="section-h reveal">Everything<br/>built in.</h2>
  <div class="feat-grid">
    <div class="feat-card reveal">
      <div class="feat-icon">🛒</div>
      <div class="feat-title">Amazon scraping</div>
      <p class="feat-desc">Extracts product title, price, images, bullet features and ratings from any Amazon URL including amzn.to short links.</p>
    </div>
    <div class="feat-card reveal">
      <div class="feat-icon">🤖</div>
      <div class="feat-title">AI pin writing</div>
      <p class="feat-desc">Gemini 2.5 Flash generates benefit-focused Pinterest titles, descriptions with bullet points and 12 relevant hashtags.</p>
    </div>
    <div class="feat-card reveal">
      <div class="feat-icon">📢</div>
      <div class="feat-title">Telegram channel</div>
      <p class="feat-desc">Product image and full pin content are automatically posted to your Telegram channel with one tap.</p>
    </div>
    <div class="feat-card reveal">
      <div class="feat-icon">📌</div>
      <div class="feat-title">Pinterest auto-post</div>
      <p class="feat-desc">Pins published directly to your Pinterest board via official Pinterest API v5 with OAuth authentication.</p>
    </div>
    <div class="feat-card reveal">
      <div class="feat-icon">📦</div>
      <div class="feat-title">Bulk processing</div>
      <p class="feat-desc">Send up to 10 Amazon links in one message. Each product gets its own unique pin posted individually.</p>
    </div>
    <div class="feat-card reveal">
      <div class="feat-icon">🔍</div>
      <div class="feat-title">SEO keywords</div>
      <p class="feat-desc">Category-specific keyword database with primary, niche, India-specific and buying-intent terms for maximum reach.</p>
    </div>
  </div>
</div>

<!-- CTA -->
<div class="cta-section reveal">
  <h2>Ready to automate<br/>your Pinterest?</h2>
  <p>Open the bot, paste an Amazon link, and watch the magic happen.</p>
  <div class="cta-btn-wrap">
    <a href="https://t.me/Pinterest_pins_bot" target="_blank" class="btn-red">✈️ Open Telegram Bot</a>
    <a href="https://github.com/keerthi-gopi/pinterestbot" target="_blank" class="btn-ghost">View on GitHub →</a>
  </div>
</div>

<!-- Footer -->
<footer>
  <div>© 2026 PinBot · Built by <a href="https://github.com/keerthi-gopi" target="_blank">Keerthi Gopi</a></div>
  <div class="footer-links">
    <a href="/privacy">Privacy Policy</a>
    <a href="https://t.me/Pinterest_Bot" target="_blank">Telegram</a>
    <a href="https://github.com/keerthi-gopi/pinterestbot" target="_blank">GitHub</a>
  </div>
</footer>

</div>

<script>
// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Stagger children of grids
document.querySelectorAll('.steps-grid, .feat-grid, .stats-row').forEach(grid => {
  grid.querySelectorAll('.step-card, .feat-card, .stat-cell').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = i * 0.08 + 's';
  });
});
</script>
</body>
</html>`);
}