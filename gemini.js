// gemini.js
export async function generatePin(product) {
  const featuresText = product.features.length
    ? product.features.slice(0, 3).map((f) => `• ${f}`).join("\n")
    : "• Premium quality\n• Great value\n• Highly rated";

  // Keep prompt output SHORT to avoid MAX_TOKENS cutoff
  const prompt = `You are a Pinterest SEO expert. Generate a Pinterest Pin as JSON.

Product: ${product.title.slice(0, 100)}
Price: ${product.price}
Features:
${featuresText}

Return ONLY this JSON (keep description under 200 chars, tags max 10):
{"title":"pin title under 80 chars","description":"under 200 chars with • bullet features and price","tags":["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8","tag9","tag10"]}`;

  console.log("🤖 Calling Gemini...");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json", // force JSON output
        },
      }),
    }
  );

  const data = await res.json();
  console.log("📡 Finish reason:", data.candidates?.[0]?.finishReason);

  if (data.error) throw new Error(`Gemini error: ${data.error.message}`);

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  console.log("🤖 Raw response:\n", raw);

  // ── Parse with fallback ────────────────────────────────
  let parsed = {};
  try {
    // Try direct parse first (responseMimeType forces clean JSON)
    parsed = JSON.parse(raw);
  } catch {
    try {
      // Try extracting JSON object
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    } catch {
      // Build from partial — extract whatever fields came through
      console.log("⚠️ Partial JSON, building from fragments...");

      const titleMatch = raw.match(/"title"\s*:\s*"([^"]+)"/);
      const descMatch = raw.match(/"description"\s*:\s*"([^"]+)"/);
      const tagsMatch = raw.match(/"tags"\s*:\s*\[([^\]]*)\]/);

      parsed = {
        title: titleMatch?.[1] || product.title.slice(0, 80),
        description: descMatch?.[1] || `${product.title.slice(0, 60)} — ${product.price}. Shop now!`,
        tags: tagsMatch
          ? tagsMatch[1].match(/"([^"]+)"/g)?.map((t) => t.replace(/"/g, "")) || []
          : ["amazon", "deals", "shopping", "musthave"],
      };
    }
  }

  // ── Fallbacks for missing fields ──────────────────────
  if (!parsed.title) parsed.title = product.title.slice(0, 80);
  if (!parsed.description) parsed.description = `${product.title.slice(0, 60)} at ${product.price}. Shop now!`;
  if (!parsed.tags?.length) parsed.tags = ["amazon", "deals", "shopping", "musthave", "onlineshopping"];

  console.log("✅ Final pin:\n", JSON.stringify(parsed, null, 2));
  return parsed;
}

export function formatPin(pin, product) {
  const tags = pin.tags
    .map((t) => (t.startsWith("#") ? t : `#${t}`))
    .join(" ");

  return (
    `📌 *Pinterest Pin*\n\n` +
    `*Title:*\n${pin.title}\n\n` +
    `*Description:*\n${pin.description}\n\n` +
    `*Price:* ${product.price}\n` +
    `*Rating:* ${product.reviewCount || product.rating || "N/A"}\n\n` +
    `*Link:*\n${product.link}\n\n` +
    `*Tags:*\n${tags}`
  );
}