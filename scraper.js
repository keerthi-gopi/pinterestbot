// scraper.js
export async function scrapeAmazonProduct(url) {
  console.log("🔍 Fetching:", url);

  const res = await fetch(`https://r.jina.ai/${url}`, {
    headers: { "Accept": "text/plain" },
  });

  if (!res.ok) throw new Error(`Jina fetch failed: ${res.status}`);

  const text = await res.text();
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // ── Title ─────────────────────────────────────────────
  let title = "";
  for (const line of lines) {
    if (line.toLowerCase().startsWith("title:")) {
      title = line.replace(/^title:\s*/i, "").trim();
      break;
    }
  }
  // Clean Amazon suffix
  title = title
    .replace(/\s*[|\-]\s*(Buy Online.*|Amazon\.in.*|Low Prices.*|Online at.*|Shop.*)/i, "")
    .trim();

  // ── Price ─────────────────────────────────────────────
  let price = "Check on Amazon";
  for (const line of lines) {
    const isJunk = line.includes("javascript") || line.includes("http") || line.includes("[");
    if (!isJunk) {
      const match = line.match(/[₹\$][0-9,]+(\.[0-9]{1,2})?/);
      if (match) {
        price = match[0];
        break;
      }
    }
  }

  // ── Rating ────────────────────────────────────────────
  let rating = "";
  for (const line of lines) {
    // Must contain X.X out of 5 and NOT be a junk/link line
    if (
      /[0-9]\.[0-9]\s*out of\s*5/i.test(line) &&
      !line.includes("javascript") &&
      !line.includes("![") &&
      !line.includes("](")
    ) {
      rating = line.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim().slice(0, 30);
      break;
    }
  }

  // ── Review count ──────────────────────────────────────
  let reviewCount = "";
  for (const line of lines) {
    if (
      /[0-9,]+\s*(ratings|reviews)/i.test(line) &&
      !line.includes("javascript") &&
      !line.includes("](")
    ) {
      reviewCount = line.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim().slice(0, 50);
      break;
    }
  }

  // ── Features ──────────────────────────────────────────
  // Only real product features — no links, no nav, no image lines, no keyboard shortcuts
  const junkPatterns = [
    /http/i,
    /javascript/i,
    /\]\(/,           // markdown links
    /!\[/,            // markdown images
    /shift\+/i,       // keyboard shortcuts
    /opt\+/i,
    /image unavailable/i,
    /add to cart/i,
    /skip to/i,
    /####|###|##/,    // markdown headings
  ];

  const features = [];
  for (const line of lines) {
    const isBullet = line.startsWith("* ") || line.startsWith("- ") || line.startsWith("• ");
    const cleaned = line.replace(/^[-*•]\s*/, "").trim();
    const isJunk = junkPatterns.some((p) => p.test(cleaned));
    if (isBullet && !isJunk && cleaned.length > 20 && cleaned.length < 300) {
      features.push(cleaned);
    }
    if (features.length >= 6) break;
  }

  // ── Image ─────────────────────────────────────────────
  // Find real product image — must be m.media-amazon.com and contain product image path
  const imageMatches = [...text.matchAll(/!\[.*?\]\((https?:\/\/[^)]+)\)/g)];
  const image =
    imageMatches
      .map((m) => m[1])
      .find(
        (src) =>
          src.includes("m.media-amazon.com/images") &&
          !src.includes("sprite") &&
          !src.includes("nav") &&
          !src.includes("fls-eu") &&
          !src.includes("_CB") === false && // allow CB versioned product images
          (src.includes("/I/") || src.includes("images/I"))
      ) ||
    imageMatches
      .map((m) => m[1])
      .find(
        (src) =>
          src.includes("m.media-amazon.com") &&
          !src.includes("sprite") &&
          !src.includes("nav") &&
          !src.includes("fls-eu") &&
          !src.includes("400x39") &&   // skip banner images
          !src.includes("_SX") === false
      ) ||
    "";

  const product = {
    title: title || "Amazon Product",
    price,
    rating,
    reviewCount,
    image,
    features,
    brand: "",
    link: url,
  };

  console.log("\n✅ CLEANED PRODUCT:\n", JSON.stringify(product, null, 2));
  return product;
}