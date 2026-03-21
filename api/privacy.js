// api/privacy.js
export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Privacy Policy — PinBot</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --red: #e60023;
      --red-dim: #b8001c;
      --bg: #070707;
      --bg2: #0c0c0c;
      --bg3: #111111;
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
      line-height:1.7;
    }

    /* Grain */
    body::after {
      content:'';
      position:fixed;inset:0;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
      pointer-events:none;z-index:999;opacity:0.28;
    }

    /* Ambient orb */
    .orb {
      position:fixed;border-radius:50%;pointer-events:none;z-index:0;
      filter:blur(120px);opacity:0.07;
    }
    .orb-1{width:600px;height:600px;background:radial-gradient(circle,#e60023,transparent 70%);top:-200px;left:-200px;}
    .orb-2{width:400px;height:400px;background:radial-gradient(circle,#ff4458,transparent 70%);bottom:-150px;right:-100px;}

    .page { position:relative; z-index:1; }

    /* ── NAV ── */
    nav {
      position:sticky;top:0;z-index:100;
      display:flex;justify-content:space-between;align-items:center;
      padding:0 clamp(20px,5vw,64px);height:68px;
      background:rgba(7,7,7,0.8);
      backdrop-filter:blur(28px);
      -webkit-backdrop-filter:blur(28px);
      border-bottom:1px solid transparent;
      transition:background 0.3s,border-color 0.3s;
      animation:navIn 0.5s ease both;
    }
    nav.scrolled {
      background:rgba(7,7,7,0.96);
      border-bottom-color:var(--border);
    }
    @keyframes navIn{from{transform:translateY(-68px);}to{transform:translateY(0);}}

    .logo {
      font-family:'Syne',sans-serif;font-weight:800;font-size:22px;
      display:flex;align-items:center;gap:10px;letter-spacing:-0.5px;
      text-decoration:none;color:var(--text);
    }
    .logo-mark {
      width:32px;height:32px;background:var(--red);border-radius:8px;
      display:flex;align-items:center;justify-content:center;font-size:16px;
      animation:pulseMark 3s ease infinite;
    }
    @keyframes pulseMark{
      0%,100%{box-shadow:0 0 0 0 rgba(230,0,35,0.4);}
      50%{box-shadow:0 0 0 8px rgba(230,0,35,0);}
    }
    .nav-back {
      color:var(--text2);text-decoration:none;font-size:14px;
      padding:8px 16px;border-radius:8px;
      transition:all 0.2s;display:flex;align-items:center;gap:6px;
    }
    .nav-back:hover{color:var(--text);background:rgba(255,255,255,0.05);}
    .nav-cta {
      background:var(--red);color:#fff;text-decoration:none;
      padding:9px 20px;border-radius:100px;font-size:13px;font-weight:600;
      transition:all 0.2s;display:flex;align-items:center;gap:6px;
    }
    .nav-cta:hover{background:var(--red-dim);transform:scale(1.03);}

    /* ── HERO ── */
    .privacy-hero {
      padding:clamp(60px,10vh,110px) clamp(20px,5vw,56px) clamp(40px,6vh,72px);
      max-width:1280px;margin:0 auto;
      animation:fadeUp 0.7s 0.1s ease both;
    }
    @keyframes fadeUp{from{transform:translateY(24px);opacity:0;}to{transform:translateY(0);opacity:1;}}

    .privacy-eyebrow {
      display:inline-flex;align-items:center;gap:12px;
      font-size:11px;font-weight:700;letter-spacing:3px;
      text-transform:uppercase;color:var(--red);margin-bottom:20px;
    }
    .privacy-eyebrow::before{content:'';width:24px;height:1px;background:var(--red);}

    .privacy-hero h1 {
      font-family:'Syne',sans-serif;
      font-size:clamp(40px,7vw,80px);font-weight:800;
      letter-spacing:clamp(-1.5px,-0.03em,-3px);line-height:1.0;
      margin-bottom:20px;
    }
    .privacy-meta {
      font-size:14px;color:var(--text3);font-weight:400;
      display:flex;align-items:center;gap:10px;
    }
    .privacy-meta-dot {
      width:4px;height:4px;background:var(--red);border-radius:50%;
    }

    /* ── CONTENT ── */
    .privacy-content {
      max-width:800px;
      margin:0 auto;
      padding:0 clamp(20px,5vw,56px) clamp(80px,12vh,140px);
    }

    .policy-section {
      margin-bottom:clamp(36px,5vh,56px);
      padding:clamp(28px,4vw,44px);
      background:var(--bg2);
      border-radius:20px;
      transition:background 0.3s;
      animation:fadeUp 0.6s ease both;
    }
    .policy-section:hover { background:var(--bg3); }

    .policy-num {
      font-family:'Syne',sans-serif;
      font-size:11px;font-weight:700;letter-spacing:3px;
      text-transform:uppercase;color:var(--red);margin-bottom:14px;
      display:flex;align-items:center;gap:10px;
    }
    .policy-num::before{content:'';width:20px;height:1px;background:var(--red);}

    .policy-section h2 {
      font-family:'Syne',sans-serif;
      font-size:clamp(18px,2.5vw,22px);font-weight:700;
      margin-bottom:16px;color:var(--text);letter-spacing:-0.5px;
    }

    .policy-section p {
      color:var(--text2);
      font-size:clamp(14px,1.5vw,15px);
      margin-bottom:14px;
      font-weight:300;
      line-height:1.75;
    }
    .policy-section p:last-child { margin-bottom:0; }

    .policy-section ul {
      color:var(--text2);
      padding-left:0;
      margin-bottom:0;
      font-size:clamp(14px,1.5vw,15px);
      list-style:none;
      display:flex;flex-direction:column;gap:10px;
    }
    .policy-section ul li {
      display:flex;align-items:flex-start;gap:12px;
      font-weight:300;line-height:1.65;
    }
    .policy-section ul li::before {
      content:'';
      width:6px;height:6px;
      background:var(--red);border-radius:50%;
      flex-shrink:0;margin-top:8px;
    }

    /* Intro block */
    .privacy-intro {
      max-width:800px;
      margin:0 auto;
      padding:0 clamp(20px,5vw,56px) clamp(32px,4vh,48px);
      animation:fadeUp 0.6s 0.2s ease both;
    }
    .privacy-intro p {
      font-size:clamp(15px,1.8vw,17px);
      color:var(--text2);
      font-weight:300;
      line-height:1.75;
    }

    /* Contact highlight */
    .contact-section {
      background:var(--bg2);
      border-radius:20px;
      padding:clamp(28px,4vw,44px);
      margin-bottom:clamp(36px,5vh,56px);
      position:relative;overflow:hidden;
      animation:fadeUp 0.6s ease both;
    }
    .contact-section::before {
      content:'';position:absolute;top:0;left:0;right:0;height:2px;
      background:linear-gradient(90deg,var(--red),rgba(230,0,35,0.3));
    }
    .contact-section h2 {
      font-family:'Syne',sans-serif;
      font-size:clamp(18px,2.5vw,22px);font-weight:700;
      margin-bottom:16px;color:var(--text);
    }
    .contact-section p {
      color:var(--text2);font-size:14px;font-weight:300;line-height:1.7;
    }
    .contact-section a {
      color:var(--red);text-decoration:none;font-weight:500;
      transition:opacity 0.2s;
    }
    .contact-section a:hover { opacity:0.75; }

    /* ── FOOTER ── */
    footer {
      padding:clamp(28px,4vh,48px) clamp(20px,5vw,64px);
      display:flex;justify-content:space-between;align-items:center;gap:20px;
      max-width:1280px;margin:0 auto;
    }
    .footer-logo {
      font-family:'Syne',sans-serif;font-weight:800;font-size:18px;
      display:flex;align-items:center;gap:8px;color:var(--text2);text-decoration:none;
    }
    .footer-mark {
      width:24px;height:24px;background:var(--red);border-radius:6px;
      display:flex;align-items:center;justify-content:center;font-size:12px;
    }
    .footer-copy { font-size:13px;color:var(--text3); }
    .footer-copy a { color:var(--red);text-decoration:none; }

    /* ── RESPONSIVE ── */
    @media(max-width:680px){
      footer { flex-direction:column; text-align:center; }
      .nav-back span { display:none; }
    }
    @media(max-width:480px){
      .policy-section { border-radius:16px; }
      .contact-section { border-radius:16px; }
    }
  </style>
</head>
<body>

<div class="orb orb-1"></div>
<div class="orb orb-2"></div>

<div class="page">

  <!-- NAV -->
  <nav id="main-nav">
    <a href="/" class="logo">
      <div class="logo-mark">📌</div>
      PinBot
    </a>
    <div style="display:flex;align-items:center;gap:8px;">
      <a href="/" class="nav-back">← <span>Back to home</span></a>
      <a href="https://t.me/Pinterest_Bot" target="_blank" class="nav-cta">✈️ Open Bot</a>
    </div>
  </nav>

  <!-- HERO -->
  <div class="privacy-hero">
    <div class="privacy-eyebrow">Legal</div>
    <h1>Privacy<br/>Policy</h1>
    <div class="privacy-meta">
      <span>Last updated: March 2026</span>
      <span class="privacy-meta-dot"></span>
      <span>PinBot · Telegram Automation</span>
    </div>
  </div>

  <!-- INTRO -->
  <div class="privacy-intro">
    <p>This Privacy Policy describes how PinBot collects, uses, and handles information when you use our Telegram bot and related services. We believe in keeping things simple and transparent.</p>
  </div>

  <!-- CONTENT -->
  <div class="privacy-content">

    <div class="policy-section">
      <div class="policy-num">01</div>
      <h2>Information We Collect</h2>
      <ul>
        <li>Telegram user ID and username (provided automatically by Telegram)</li>
        <li>Amazon product URLs you send to the bot</li>
        <li>Publicly available product data scraped from Amazon</li>
      </ul>
    </div>

    <div class="policy-section">
      <div class="policy-num">02</div>
      <h2>How We Use Information</h2>
      <ul>
        <li>Scrape Amazon product data from URLs you provide</li>
        <li>Generate Pinterest pin content using AI</li>
        <li>Post generated pins to your Telegram channel</li>
        <li>Post generated pins to your Pinterest board</li>
      </ul>
    </div>

    <div class="policy-section">
      <div class="policy-num">03</div>
      <h2>Pinterest Data</h2>
      <p>PinBot uses the Pinterest API to create and publish pins on your behalf. We request only the minimum permissions required: <strong style="color:var(--text);font-weight:500;">pins:write</strong> and <strong style="color:var(--text);font-weight:500;">boards:read</strong>. We do not store your Pinterest credentials beyond what is needed to operate the service.</p>
    </div>

    <div class="policy-section">
      <div class="policy-num">04</div>
      <h2>Data Storage</h2>
      <p>We do not store any personal data, product URLs, or generated content in a database. All processing happens in real time and is discarded after the request is complete. Nothing is persisted.</p>
    </div>

    <div class="policy-section">
      <div class="policy-num">05</div>
      <h2>Third Party Services</h2>
      <ul>
        <li>Telegram API — to receive and send messages</li>
        <li>Scrapingdog — to scrape Amazon product data</li>
        <li>Google Gemini API — to generate pin content</li>
        <li>Pinterest API — to publish pins to your board</li>
      </ul>
    </div>

    <div class="policy-section">
      <div class="policy-num">06</div>
      <h2>Data Sharing</h2>
      <p>We do not sell, trade, or share your personal data with any third parties except as required to operate the services listed above. Your data is never used for advertising or sold to data brokers.</p>
    </div>

    <div class="policy-section">
      <div class="policy-num">07</div>
      <h2>Security</h2>
      <p>All API keys and credentials are stored securely as environment variables and are never exposed publicly. We follow standard security practices for serverless deployments on Vercel.</p>
    </div>

    <div class="policy-section">
      <div class="policy-num">08</div>
      <h2>Children's Privacy</h2>
      <p>PinBot is not directed at children under 13. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us immediately.</p>
    </div>

    <div class="policy-section">
      <div class="policy-num">09</div>
      <h2>Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. Changes will be reflected on this page with an updated date at the top.</p>
    </div>

    <div class="contact-section">
      <h2>10 · Contact</h2>
      <p>For any questions about this Privacy Policy or your data, reach out via GitHub:</p>
      <p style="margin-top:12px;">
        <a href="https://github.com/keerthi-gopi">github.com/keerthi-gopi</a>
      </p>
    </div>

  </div>

  <!-- FOOTER -->
  <footer>
    <a href="/" class="footer-logo">
      <div class="footer-mark">📌</div>
      PinBot
    </a>
    <div class="footer-copy">© 2026 Built by <a href="https://github.com/keerthi-gopi" target="_blank">Keerthi Gopi</a></div>
  </footer>

</div>

<script>
  // Nav border on scroll
  window.addEventListener('scroll', function(){
    var nav = document.getElementById('main-nav');
    if(window.scrollY > 20){
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, {passive:true});

  // Staggered section reveal
  (function(){
    var style = document.createElement('style');
    style.textContent = '.policy-section,.contact-section{opacity:0;transform:translateY(20px);transition:opacity 0.55s ease,transform 0.55s ease;}.policy-section.in,.contact-section.in{opacity:1;transform:translateY(0);}';
    document.head.appendChild(style);

    var sections = document.querySelectorAll('.policy-section, .contact-section');
    sections.forEach(function(el, i){
      el.style.transitionDelay = (i * 0.06) + 's';
    });

    function reveal(){
      sections.forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.top < window.innerHeight - 50){ el.classList.add('in'); }
      });
    }
    window.addEventListener('scroll', reveal, {passive:true});
    setTimeout(reveal, 150);
    setTimeout(function(){ sections.forEach(function(el){ el.classList.add('in'); }); }, 2000);
  })();
</script>
</body>
</html>`);
}