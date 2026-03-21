// api/webhook.js
import { Telegraf } from "telegraf";
import { scrapeAmazonProduct } from "../scraper.js";
import { generatePin, formatPin } from "../gemini.js";
import { Redis } from "@upstash/redis";
import { getValidToken, setBoard, getBoard, clearAll } from "../lib/tokenstore.js";
import { getBoards, postPin } from "../pinterest.js";

const kv = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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

    // Post to Telegram channel
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

    // Post to Pinterest (non-fatal)
    let pinUrl = null;
    try {
      const accessToken = await getValidToken(ctx.from.id);
      const board = await getBoard(ctx.from.id);
      if (accessToken && board) {
        const result = await postPin(product, pin, accessToken, board.id);
        pinUrl = `https://www.pinterest.com/pin/${result.id}/`;
        console.log("Pinterest pin created:", pinUrl);
      }
    } catch (pErr) {
      console.log("Pinterest failed (non-fatal):", pErr.message);
    }

    await ctx.reply(
      `✅ Posted ${index}/${total}\n\n📌 *${pin.title}*\n💰 ${product.price}` +
      (pinUrl
        ? `\n\n📌 Pinterest: ${pinUrl}`
        : "\n\n_(Pinterest not connected — use /connect)_"),
      { parse_mode: "Markdown" }
    );

    return { success: true, url, title: pin.title };

  } catch (err) {
    await ctx.reply(`❌ Failed ${index}/${total}: ${err.message}`);
    return { success: false, url, error: err.message };
  }
}

// ── /start ────────────────────────────────────────────────
bot.start((ctx) =>
  ctx.reply(
    `👋 Hi! Send Amazon product links (one per line) and I'll generate Pinterest pins and post them to the channel!\n\n` +
    `Commands:\n` +
    `/connect — link your Pinterest account\n` +
    `/boards — choose which board to post to\n` +
    `/status — check connection status\n` +
    `/disconnect — unlink Pinterest\n\n` +
    `Example:\nhttps://www.amazon.in/dp/XXXXX\nhttps://www.amazon.in/dp/YYYYY`
  )
);

// ── /help ─────────────────────────────────────────────────
bot.command("help", (ctx) =>
  ctx.reply(
    `📋 *How to use:*\n\n` +
    `1. /connect — link Pinterest\n` +
    `2. /boards — pick a board\n` +
    `3. Paste Amazon links (max 10 at once)\n\n` +
    `Supported URLs:\n• amazon.in\n• amazon.com\n• amzn.to`,
    { parse_mode: "Markdown" }
  )
);

// ── /connect ──────────────────────────────────────────────
bot.command("connect", async (ctx) => {
  const authUrl =
    "https://www.pinterest.com/oauth/?" +
    `client_id=${process.env.PINTEREST_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.PINTEREST_REDIRECT_URI)}` +
    "&response_type=code" +
    "&scope=pins:write,boards:read" +
    `&state=${ctx.from.id}`;

  await ctx.reply("Tap below to connect your Pinterest account:", {
    reply_markup: {
      inline_keyboard: [[{ text: "Connect Pinterest", url: authUrl }]],
    },
  });
});

// ── /boards ───────────────────────────────────────────────
bot.command("boards", async (ctx) => {
  const token = await getValidToken(ctx.from.id);
  if (!token) return ctx.reply("Not connected yet. Use /connect first.");

  let boards;
  try {
    boards = await getBoards(token);
  } catch (e) {
    return ctx.reply("Could not fetch boards: " + e.message);
  }

  if (!boards.length) return ctx.reply("No public boards found on your account.");

  await kv.set(`boardlist:${ctx.from.id}`, boards);

  const list = boards.map((b, i) => `${i + 1}. ${b.name}`).join("\n");
  await ctx.reply(
    "Your Pinterest boards:\n\n" + list +
    "\n\nReply with the number to select one."
  );
});

// ── /disconnect ───────────────────────────────────────────
bot.command("disconnect", async (ctx) => {
  await clearAll(ctx.from.id);
  ctx.reply("Pinterest disconnected. Use /connect to reconnect.");
});

// ── /status ───────────────────────────────────────────────
bot.command("status", async (ctx) => {
  const token = await getValidToken(ctx.from.id);
  const board = await getBoard(ctx.from.id);
  if (!token) return ctx.reply("Not connected. Use /connect.");
  ctx.reply(
    "✅ Connected to Pinterest\n" +
    (board ? `📌 Board: ${board.name}` : "⚠️ No board selected. Use /boards.")
  );
});

// ── Handle text messages ──────────────────────────────────
bot.on("text", async (ctx) => {
  const text = ctx.message.text.trim();
  if (text.startsWith("/")) return;

  // Board number selection — intercept before Amazon URL check
  const boardList = await kv.get(`boardlist:${ctx.from.id}`);
  if (boardList && /^\d+$/.test(text)) {
    const boards = Array.isArray(boardList) ? boardList : [];
    const idx = parseInt(text, 10) - 1;
    if (idx >= 0 && idx < boards.length) {
      await setBoard(ctx.from.id, boards[idx].id, boards[idx].name);
      await kv.del(`boardlist:${ctx.from.id}`);
      return ctx.reply(`✅ Board set to "${boards[idx].name}". Ready to post pins!`);
    }
  }

  // Amazon URL processing
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
      ? `Failed:\n${results
          .filter((r) => !r.success)
          .map((r) => `• ${r.url}`)
          .join("\n")}`
      : `All pins posted successfully! 🎊`),
    { parse_mode: "Markdown" }
  );
});

// ── Vercel serverless handler ─────────────────────────────
export default async function handler(req, res) {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body);
    res.status(200).json({ ok: true });
  } else {
    res.status(200).send("Bot is alive.");
  }
}