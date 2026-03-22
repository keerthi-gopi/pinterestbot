import { Telegraf } from "telegraf";
import { storeTokens } from "../lib/tokenstore.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

export default async function handler(req, res) {
  const { code, state: userId, error } = req.query;

  if (error || !code) {
    res.status(400).send("Pinterest login failed. Close this and try /connect again.");
    return;
  }

  const creds = Buffer.from(
    `${process.env.PINTEREST_APP_ID}:${process.env.PINTEREST_APP_SECRET}`
  ).toString("base64");
 const tokenRes = await fetch("https://api.pinterest.com/v5/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${creds}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.PINTEREST_REDIRECT_URI,
    }),
  });

  const tokens = await tokenRes.json();

  if (!tokens.access_token) {
    res.status(400).send("Token exchange failed. Try /connect again.");
    return;
  }

   await storeTokens(userId, tokens);

  // Notify the user back in Telegram
  try {
    await bot.telegram.sendMessage(
      userId,
      "Pinterest connected! Now use /boards to choose which board to post to."
    );
  } catch (_) {}

  res.status(200).send(`
    <!DOCTYPE html><html><body style="font-family:sans-serif;
    text-align:center;padding:60px 24px;background:#fff">
    <h2 style="color:#e60023">Pinterest connected!</h2>
    <p style="color:#666;margin-top:12px">Close this tab and go back to Telegram.</p>
    </body></html>
  `);
}