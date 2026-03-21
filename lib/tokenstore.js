import { Redis } from "@upstash/redis";

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function storeTokens(userId, tokens) {
  await kv.set(`pinterest:${userId}`, {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in ?? 2592000) * 1000,
  });
}

export async function getTokens(userId) {
  return await kv.get(`pinterest:${userId}`);
}

export async function getValidToken(userId) {
  const t = await getTokens(userId);
  if (!t) return null;
  if (Date.now() < t.expires_at - 300000) return t.access_token;

  // Refresh expired token
  const creds = Buffer.from(
    `${process.env.PINTEREST_APP_ID}:${process.env.PINTEREST_APP_SECRET}`
  ).toString("base64");
  const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${creds}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: t.refresh_token,
    }),
  });
  const newT = await res.json();
  if (!newT.access_token) return null;
  await storeTokens(userId, newT);
  return newT.access_token;
}

export async function setBoard(userId, boardId, boardName) {
  await kv.set(`board:${userId}`, { id: boardId, name: boardName });
}

export async function getBoard(userId) {
  return await kv.get(`board:${userId}`);
}

export async function clearAll(userId) {
  await kv.del(`pinterest:${userId}`);
  await kv.del(`board:${userId}`);
  await kv.del(`boardlist:${userId}`);
}