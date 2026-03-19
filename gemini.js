// gemini.js
import { getKeywords } from "./keywords.js";

export async function generatePin(product) {
  console.log("🤖 Generating pin for:", product.title);

  // Get SEO keywords for this product category
  const seoKeywords = getKeywords(product.title);
  const keywordsText = seoKeywords.join(", ");

  // Build features text
  const featuresText = product.features.length
    ? product.features.slice(0, 4).map((f) => `• ${f}`).join("\n")
    : "• Check product page for full details";

  const prompt = `You are a Pinterest SEO content expert for the Indian market.

Create a Pinterest Pin for this Amazon product.

Product: ${product.title}
Brand: ${product.brand || "N/A"}
Price: ${product.price}
Rating: ${product.rating || "N/A"} (${product.reviewCount || ""})
Category: ${product.category || "General"}
Key Features:
${featuresText}

Pinterest SEO Keywords to include naturally:
${keywordsText}

Rules:
- Title: max 80 chars, include top 1-2 SEO keywords, benefit-focused, catchy
- Description: 150-200 chars, use • for 2-3 key features, mention price, end with call to action
- Tags: 12 tags, mix of broad + niche + India-specific, NO # symbol, NO spaces in tags

Return ONLY raw JSON. Start with { end with }. No markdown, no backticks:
{
  "title": "pin title here",
  "description": "pin description here",
  "tags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8","tag9","tag10","tag11","tag12"]
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const data = await res.json();
  console.log("📡 Gemini status:", res.status);
  console.log("📡 Finish reason:", data.candidates?.[0]?.finishReason);

  // Check for API errors
  if (data.error) throw new Error(`Gemini error: ${data.error.message}`);
  if (!data.candidates?.length) throw new Error("Gemini returned no response");

  const raw = data.candidates[0]?.content?.parts?.[0]?.text || "";
  console.log("🤖 Gemini raw:\n", raw);

  // ── Parse JSON safely ─────────────────────────────────
  let parsed = {};

  try {
    parsed = JSON.parse(raw);
  } catch {
    // Try extracting JSON object if there's extra text
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        console.log("⚠️ JSON parse failed, using fallbacks");
      }
    }
  }

  // ── Fallbacks for missing fields ──────────────────────
  if (!parsed.title) {
    parsed.title = product.title.slice(0, 80);
  }
  if (!parsed.description) {
    parsed.description =
      `${product.title.slice(0, 60)} at ${product.price}. Shop now on Amazon India!`;
  }
  if (!parsed.tags?.length) {
    parsed.tags = seoKeywords.map((k) => k.replace(/\s+/g, ""));
  }

  console.log("✅ Final pin:", JSON.stringify(parsed, null, 2));
  return parsed;
}

// ── Format pin for Telegram channel post ─────────────────
export function formatPin(pin, product) {
  const tags = pin.tags
    .map((t) => (t.startsWith("#") ? t : `#${t}`))
    .join(" ");

  return (
    `📌 *${pin.title}*\n\n` +
    `${pin.description}\n\n` +
    `💰 *Price:* ${product.price}\n` +
    `⭐ *Rating:* ${product.rating || "N/A"} ` +
    `${product.reviewCount ? `(${product.reviewCount})` : ""}\n\n` +
    `🛒 *Buy here:* ${product.link}\n\n` +
    `${tags}`
  );
}