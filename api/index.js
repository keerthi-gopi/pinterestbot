// api/index.js
export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PinBot — Amazon to Pinterest Automation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0f0f; color: #fff; min-height: 100vh; }
    nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid #1e1e1e; }
    .logo { font-size: 22px; font-weight: 700; color: #e60023; }
    .logo span { color: #fff; }
    .nav-btn { background: #e60023; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; }
    .nav-btn:hover { background: #c0001e; }
    .hero { text-align: center; padding: 100px 20px 60px; }
    .badge { display: inline-block; background: #1a1a1a; border: 1px solid #333; color: #aaa; font-size: 13px; padding: 6px 16px; border-radius: 20px; margin-bottom: 24px; }
    .badge span { color: #e60023; }
    h1 { font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; max-width: 800px; margin-left: auto; margin-right: auto; }
    h1 em { font-style: normal; color: #e60023; }
    .subtitle { font-size: 18px; color: #888; max-width: 520px; margin: 0 auto 40px; line-height: 1.6; }
    .hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .btn-primary { background: #e60023; color: #fff; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
    .btn-primary:hover { background: #c0001e; }
    .btn-secondary { background: transparent; color: #fff; border: 1px solid #333; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
    .btn-secondary:hover { border-color: #666; }
    .stats { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; padding: 60px 40px; border-top: 1px solid #1e1e1e; border-bottom: 1px solid #1e1e1e; }
    .stat { text-align: center; }
    .stat h2 { font-size: 40px; font-weight: 800; color: #e60023; }
    .stat p { font-size: 14px; color: #777; margin-top: 4px; }
    .section { padding: 80px 40px; max-width: 1100px; margin: 0 auto; }
    .section-label { text-align: center; color: #e60023; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
    .section-title { text-align: center; font-size: 36px; font-weight: 800; margin-bottom: 60px; }
    .steps { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
    .step { background: #141414; border: 1px solid #222; border-radius: 16px; padding: 32px; flex: 1; min-width: 200px; max-width: 230px; text-align: center; transition: border-color 0.2s; }
    .step:hover { border-color: #e60023; }
    .step-num { width: 48px; height: 48px; background: #e60023; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; margin: 0 auto 16px; }
    .step h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
    .step p { font-size: 14px; color: #777; line-height: 1.5; }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .feature { background: #141414; border: 1px solid #222; border-radius: 16px; padding: 28px; transition: border-color 0.2s; }
    .feature:hover { border-color: #e60023; }
    .feature-icon { font-size: 32px; margin-bottom: 16px; }
    .feature h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .feature p { font-size: 14px; color: #777; line-height: 1.6; }
    .cta-box { background: #141414; border: 1px solid #222; border-radius: 20px; padding: 40px; text-align: center; margin: 0 auto; max-width: 600px; }
    .cta-box h2 { font-size: 28px; font-weight: 800; margin-bottom: 12px; }
    .cta-box p { color: #777; margin-bottom: 32px; font-size: 15px; }
    footer { text-align: center; padding: 40px; color: #555; font-size: 14px; border-top: 1px solid #1e1e1e; }
    footer a { color: #e60023; text-decoration: none; }
    @media (max-width: 600px) { h1 { font-size: 36px; } nav { padding: 16px 20px; } .section { padding: 60px 20px; } }
  </style>
</head>
<body>
  <nav>
    <div class="logo">Pin<span>Bot</span></div>
    <a href="https://t.me/Pinterest_pins_bot" class="nav-btn" target="_blank">Open in Telegram</a>
  </nav>

  <div class="hero">
    <div class="badge">🤖 Powered by <span>Gemini 2.5 Flash</span></div>
    <h1>Amazon links to<br/><em>Pinterest Pins</em><br/>automatically</h1>
    <p class="subtitle">Send Amazon product URLs to our Telegram bot and get SEO-optimized Pinterest pins posted to your channel instantly.</p>
    <div class="hero-btns">
      <a href="https://t.me/Pinterest_pins_bot" class="btn-primary" target="_blank">✈️ Open Telegram Bot</a>
      <a href="#how" class="btn-secondary">See how it works ↓</a>
    </div>
  </div>

  <div class="stats">
    <div class="stat"><h2>10x</h2><p>Faster than manual pinning</p></div>
    <div class="stat"><h2>10</h2><p>Products at once</p></div>
    <div class="stat"><h2>100%</h2><p>SEO optimized</p></div>
    <div class="stat"><h2>Free</h2><p>No subscription</p></div>
  </div>

  <div class="section" id="how">
    <p class="section-label">How it works</p>
    <h2 class="section-title">From Amazon link to Pinterest in seconds</h2>
    <div class="steps">
      <div class="step"><div class="step-num">1</div><h3>Send links</h3><p>Paste 1–10 Amazon product URLs in the Telegram bot</p></div>
      <div class="step"><div class="step-num">2</div><h3>Auto scrape</h3><p>Bot scrapes title, price, image and features from Amazon</p></div>
      <div class="step"><div class="step-num">3</div><h3>AI generates</h3><p>Gemini AI writes SEO-optimized title, description and hashtags</p></div>
      <div class="step"><div class="step-num">4</div><h3>Auto post</h3><p>Pin posted to Telegram channel and Pinterest automatically</p></div>
    </div>
  </div>

  <div class="section">
    <p class="section-label">Features</p>
    <h2 class="section-title">Everything you need</h2>
    <div class="features">
      <div class="feature"><div class="feature-icon">🛒</div><h3>Amazon scraping</h3><p>Extracts product title, price, images, features and ratings automatically.</p></div>
      <div class="feature"><div class="feature-icon">🤖</div><h3>AI pin writing</h3><p>Gemini 2.5 Flash generates benefit-focused titles, descriptions and hashtags.</p></div>
      <div class="feature"><div class="feature-icon">📢</div><h3>Telegram channel</h3><p>Pins with product image posted automatically to your Telegram channel.</p></div>
      <div class="feature"><div class="feature-icon">📌</div><h3>Pinterest auto-post</h3><p>Pins published directly to your Pinterest board via official API.</p></div>
      <div class="feature"><div class="feature-icon">📦</div><h3>Bulk processing</h3><p>Send up to 10 Amazon links at once — each gets its own unique pin.</p></div>
      <div class="feature"><div class="feature-icon">🔍</div><h3>SEO keywords</h3><p>Category-specific keywords ensure your pins rank on Pinterest search.</p></div>
    </div>
  </div>

  <div class="section">
    <div class="cta-box">
      <h2>Start for free</h2>
      <p>Open the Telegram bot and paste your first Amazon link.</p>
      <a href="https://t.me/Pinterest_pins_bot" class="btn-primary" target="_blank" style="display:inline-flex;justify-content:center;width:100%;margin-bottom:12px;">✈️ Open Telegram Bot</a>
      <p style="font-size:13px;color:#555;">No sign up required. Just open and send a link.</p>
    </div>
  </div>

  <footer>
    <p>Built by <a href="https://github.com/keerthi-gopi" target="_blank">Keerthi Gopi</a> · <a href="/privacy">Privacy Policy</a> · Powered by Gemini AI · 2026</p>
  </footer>
</body>
</html>`);
}