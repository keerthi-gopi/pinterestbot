// api/webhook.js
import { Telegraf } from "telegraf";
import { scrapeAmazonProduct } from "../scraper.js";
import { generatePin, formatPin } from "../gemini.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

function isAmazonUrl(text) {
  return /https?:\/\/(www\.)?(amazon\.(in|com|co\.uk|de|fr|ca|com\.au)|amzn\.(to|in))/i.test(text);
}

bot.start((ctx) =>
  ctx.reply(
    `👋 Hi! I turn Amazon links into Pinterest Pins.\n\n` +
    `Paste any Amazon product URL and I'll generate a full pin!\n\n` +
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

  await ctx.reply("🔍 Scraping Amazon product...");

  try {
    const product = await scrapeAmazonProduct(text);

    if (!product.title) {
      return ctx.reply("❌ Couldn't extract product. Try again.");
    }

    await ctx.reply("✅ Product found! Writing Pinterest Pin...");
    const pin = await generatePin(product);

    if (product.image) {
      try {
        await ctx.replyWithPhoto(
          { url: product.image },
          { caption: `🛍️ *${product.title}*`, parse_mode: "Markdown" }
        );
      } catch {}
    }

    await ctx.reply(formatPin(pin, product), { parse_mode: "Markdown" });
    await ctx.reply("✅ Pin ready! Copy and paste to Pinterest.");
  } catch (err) {
    await ctx.reply(`❌ Error: ${err.message}`);
  }
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body);
    res.status(200).json({ ok: true });
  } else {
    res.status(200).send("Bot is alive.");
  }
}
