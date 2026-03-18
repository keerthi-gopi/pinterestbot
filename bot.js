// bot.js
import "dotenv/config";
import { Telegraf } from "telegraf";
import { scrapeAmazonProduct } from "./scraper.js";
import { generatePin, formatPin } from "./gemini.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

function isAmazonUrl(text) {
  return /https?:\/\/(www\.)?(amazon\.(in|com|co\.uk|de|fr|ca|com\.au)|amzn\.(to|in))/i.test(text);
}

bot.start((ctx) =>
  ctx.reply(
    `👋 Hi! I turn Amazon links into Pinterest Pins.\n\n` +
    `Just paste any Amazon product URL and I'll generate a full pin with image, title, description, link and tags!\n\n` +
    `Example:\nhttps://www.amazon.in/dp/XXXXXXXXXX`
  )
);

bot.command("help", (ctx) =>
  ctx.reply(
    `📋 How to use:\n\n` +
    `1. Open Amazon\n` +
    `2. Go to any product page\n` +
    `3. Copy the URL\n` +
    `4. Paste it here\n\n` +
    `I'll handle everything else!`
  )
);

bot.on("text", async (ctx) => {
  const text = ctx.message.text.trim();
  if (text.startsWith("/")) return;

  if (!isAmazonUrl(text)) {
    return ctx.reply(
      `⚠️ Please send a valid Amazon product URL.\n\nExample:\nhttps://www.amazon.in/dp/XXXXXXXXXX`
    );
  }

  const statusMsg = await ctx.reply("🔍 Scraping Amazon product...");

  try {
    // Step 1 — Scrape product
    const product = await scrapeAmazonProduct(text);

    if (!product.title) {
      return ctx.reply("❌ Couldn't extract product data. Try again in a moment.");
    }

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      statusMsg.message_id,
      null,
      "✅ Product found! Writing Pinterest Pin..."
    );

    // Step 2 — Generate pin with Gemini
    const pin = await generatePin(product);

    // Step 3 — Send product image
    if (product.image) {
      try {
        await ctx.replyWithPhoto(
          { url: product.image },
          { caption: `🛍️ *${product.title}*`, parse_mode: "Markdown" }
        );
      } catch {
        // image failed, skip silently
      }
    }

    // Step 4 — Send the pin
    await ctx.reply(formatPin(pin, product), { parse_mode: "Markdown" });
    await ctx.reply("✅ Pin ready! Copy and paste to Pinterest.");

  } catch (err) {
    console.error(err);
    await ctx.reply(`❌ Error: ${err.message}`);
  }
});

bot.launch();
console.log("✅ Bot is running locally...");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));