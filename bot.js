// bot.js
import "dotenv/config";
import { Telegraf } from "telegraf";
import { scrapeAmazonProduct } from "./scraper.js";
import { generatePin, formatPin } from "./gemini.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

// ── Extract all Amazon URLs from message ──────────────────
function extractAmazonUrls(text) {
  const regex = /https?:\/\/(www\.)?(amazon\.(in|com|co\.uk|de|fr|ca|com\.au)|amzn\.(to|in))[^\s]*/gi;
  return [...new Set(text.match(regex) || [])];
}

// ── Process single product ────────────────────────────────
async function processProduct(url, index, total, ctx) {
  try {
    await ctx.reply(`🔍 Processing ${index}/${total}:\n${url}`);

    // 1. Scrape product
    const product = await scrapeAmazonProduct(url);
    if (!product.title) throw new Error("Could not extract product info");

    // 2. Generate pin
    const pin = await generatePin(product);

    // 3. Format channel message
    const channelMessage = formatPin(pin, product);

    console.log("📢 Posting to channel:", CHANNEL_ID);
    console.log("📢 Message preview:", channelMessage.slice(0, 100));

    // 4. Post to channel
    if (product.image) {
      console.log("🖼️ Image URL:", product.image);
      try {
        await bot.telegram.sendPhoto(
          CHANNEL_ID,
          { url: product.image },
          {
            caption: channelMessage,
            parse_mode: "Markdown",
          }
        );
        console.log("✅ Image posted to channel");
      } catch (imgErr) {
        console.log("⚠️ Image failed:", imgErr.message, "— trying text only");
        await bot.telegram.sendMessage(CHANNEL_ID, channelMessage, {
          parse_mode: "Markdown",
        });
        console.log("✅ Text posted to channel");
      }
    } else {
      console.log("⚠️ No image — posting text only");
      await bot.telegram.sendMessage(CHANNEL_ID, channelMessage, {
        parse_mode: "Markdown",
      });
      console.log("✅ Text posted to channel");
    }

    // 5. Confirm to user
    await ctx.reply(
      `✅ Posted ${index}/${total}\n\n` +
      `📌 *${pin.title}*\n` +
      `💰 ${product.price}`,
      { parse_mode: "Markdown" }
    );

    return { success: true, url, title: pin.title };

  } catch (err) {
    console.error(`❌ Full error on ${url}:`, err);
    await ctx.reply(`❌ Failed ${index}/${total}\nReason: ${err.message}`);
    return { success: false, url, error: err.message };
  }
}

// ── /start ────────────────────────────────────────────────
bot.start((ctx) =>
  ctx.reply(
    `👋 Hi! I turn Amazon links into Pinterest Pins.\n\n` +
    `Send one or multiple Amazon links (one per line) and I'll:\n` +
    `• Scrape each product\n` +
    `• Generate a Pinterest pin\n` +
    `• Post it to the channel\n\n` +
    `Example:\n` +
    `https://www.amazon.in/dp/XXXXX\n` +
    `https://www.amazon.in/dp/YYYYY\n` +
    `https://amzn.to/ZZZZZ\n\n` +
    `Max 10 links at once.`
  )
);

// ── /help ─────────────────────────────────────────────────
bot.command("help", (ctx) =>
  ctx.reply(
    `📋 *How to use:*\n\n` +
    `1. Copy Amazon product URL(s)\n` +
    `2. Paste here — one per line\n` +
    `3. Bot scrapes, generates pin and posts to channel\n\n` +
    `*Supported URLs:*\n` +
    `• amazon.in/dp/XXXXX\n` +
    `• amazon.com/dp/XXXXX\n` +
    `• amzn.to/XXXXX\n\n` +
    `*Limit:* 10 links per message`,
    { parse_mode: "Markdown" }
  )
);

// ── Handle text messages ──────────────────────────────────
bot.on("text", async (ctx) => {
  const text = ctx.message.text.trim();
  if (text.startsWith("/")) return;

  const urls = extractAmazonUrls(text);

  // No URLs found
  if (urls.length === 0) {
    return ctx.reply(
      `⚠️ No Amazon links found.\n\n` +
      `Please send links like:\n` +
      `https://www.amazon.in/dp/XXXXX`
    );
  }

  // Too many URLs
  if (urls.length > 10) {
    return ctx.reply(
      `⚠️ You sent ${urls.length} links. Max is 10 at a time.\n` +
      `Please split into smaller batches.`
    );
  }

  // Confirm received
  await ctx.reply(
    `📦 Found *${urls.length}* product${urls.length > 1 ? "s" : ""}. Starting...\n\n` +
    urls.map((u, i) => `${i + 1}. ${u}`).join("\n"),
    { parse_mode: "Markdown" }
  );

  const results = [];

  // Process each URL one by one
  for (let i = 0; i < urls.length; i++) {
    const result = await processProduct(urls[i], i + 1, urls.length, ctx);
    results.push(result);

    // 2 second delay between products to avoid rate limits
    if (i < urls.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // Final summary
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  await ctx.reply(
    `🎉 *Done!*\n\n` +
    `✅ Posted: ${successful}/${urls.length} pins\n` +
    `❌ Failed: ${failed}/${urls.length}\n\n` +
    (failed > 0
      ? `*Failed links:*\n${results
          .filter((r) => !r.success)
          .map((r) => `• ${r.url}`)
          .join("\n")}`
      : `All pins posted to channel successfully! 🎊`),
    { parse_mode: "Markdown" }
  );
});

// ── Launch bot (polling mode for local) ───────────────────
bot.launch();
console.log("✅ Bot running locally in polling mode...");
console.log(`📢 Channel ID: ${CHANNEL_ID}`);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

