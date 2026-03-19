// api/webhook.js
import { Telegraf } from "telegraf";
import { scrapeAmazonProduct } from "../scraper.js";
import { generatePin, formatPin } from "../gemini.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

// ── Extract all Amazon URLs ───────────────────────────────
function extractAmazonUrls(text) {
  const regex = /https?:\/\/(www\.)?(amazon\.(in|com|co\.uk|de|fr|ca|com\.au)|amzn\.(to|in))[^\s]*/gi;
  return [...new Set(text.match(regex) || [])];
}

// ── Process single product ────────────────────────────────
async function processProduct(url, index, total, ctx) {
  try {
    await ctx.reply(`🔍 Processing ${index}/${total}...`);

    const product = await scrapeAmazonProduct(url);
    if (!product.title) throw new Error("Could not extract product info");

    const pin = await generatePin(product);
    const channelMessage = formatPin(pin, product);

    if (product.image) {
      try {
        await bot.telegram.sendPhoto(
          CHANNEL_ID,
          { url: product.image },
          { caption: channelMessage, parse_mode: "Markdown" }
        );
      } catch {
        await bot.telegram.sendMessage(CHANNEL_ID, channelMessage, {
          parse_mode: "Markdown",
        });
      }
    } else {
      await bot.telegram.sendMessage(CHANNEL_ID, channelMessage, {
        parse_mode: "Markdown",
      });
    }

    await ctx.reply(
      `✅ Posted ${index}/${total}\n\n📌 *${pin.title}*\n💰 ${product.price}`,
      { parse_mode: "Markdown" }
    );

    return { success: true, url, title: pin.title };

  } catch (err) {
    await ctx.reply(`❌ Failed ${index}/${total}: ${err.message}`);
    return { success: false, url, error: err.message };
  }
}

// ── Bot handlers ──────────────────────────────────────────
bot.start((ctx) =>
  ctx.reply(
    `👋 Hi! Send Amazon product links (one per line) and I'll generate Pinterest pins and post them to the channel!\n\n` +
    `Example:\nhttps://www.amazon.in/dp/XXXXX\nhttps://www.amazon.in/dp/YYYYY`
  )
);

bot.command("help", (ctx) =>
  ctx.reply(
    `📋 Send Amazon links one per line.\nMax 10 at a time.\n\n` +
    `Supported:\n• amazon.in\n• amazon.com\n• amzn.to`
  )
);

bot.on("text", async (ctx) => {
  const text = ctx.message.text.trim();
  if (text.startsWith("/")) return;

  const urls = extractAmazonUrls(text);

  if (urls.length === 0) {
    return ctx.reply(
      `⚠️ No Amazon links found.\nSend links like:\nhttps://www.amazon.in/dp/XXXXX`
    );
  }

  if (urls.length > 10) {
    return ctx.reply(`⚠️ Max 10 links at a time. You sent ${urls.length}.`);
  }

  await ctx.reply(
    `📦 Found *${urls.length}* product${urls.length > 1 ? "s" : ""}. Processing...\n\n` +
    urls.map((u, i) => `${i + 1}. ${u}`).join("\n"),
    { parse_mode: "Markdown" }
  );

  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const result = await processProduct(urls[i], i + 1, urls.length, ctx);
    results.push(result);
    if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 2000));
  }

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  await ctx.reply(
    `🎉 *Done!*\n\n` +
    `✅ Posted: ${successful}/${urls.length} pins\n` +
    `❌ Failed: ${failed}/${urls.length}\n\n` +
    (failed > 0
      ? `Failed:\n${results.filter((r) => !r.success).map((r) => `• ${r.url}`).join("\n")}`
      : `All pins posted to channel successfully! 🎊`),
    { parse_mode: "Markdown" }
  );
});

// ── Vercel handler ────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body);
    res.status(200).json({ ok: true });
  } else {
    res.status(200).send("Bot is alive.");
  }
}