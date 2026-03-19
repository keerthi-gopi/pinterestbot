// scraper.js
export async function scrapeAmazonProduct(url) {
  console.log("🔍 Scraping:", url);

  // Scrapingdog Amazon-specific endpoint
  // Returns clean structured JSON — no HTML parsing needed
  const apiUrl = `https://api.scrapingdog.com/amazon/product` +
    `?api_key=${process.env.SCRAPINGDOG_API_KEY}` +
    `&url=${encodeURIComponent(url)}` +
    `&country=in`;

  const res = await fetch(apiUrl);

  if (!res.ok) throw new Error(`Scrapingdog failed: ${res.status}`);

  const data = await res.json();
  console.log("📦 Scrapingdog raw:", JSON.stringify(data, null, 2));

  // Map Scrapingdog fields to our product format
  const product = {
    title:
      data.title ||
      data.product_title ||
      "",

    price:
      data.price ||
      data.product_price ||
      data.buying_price ||
      "Check on Amazon",

    rating:
      data.average_rating ||
      data.rating ||
      "",

    reviewCount:
      data.total_reviews ||
      data.reviews_count ||
      data.ratings_count ||
      "",

    // First image from images array or fallback fields
    image:
      data.images?.[0] ||
      data.product_image ||
      data.main_image ||
      data.thumbnail ||
      "",

    // Feature bullets — real product features
    features:
      data.feature_bullets ||
      data.features ||
      data.bullet_points ||
      [],

    brand:
      data.brand ||
      data.product_brand ||
      data.manufacturer ||
      "",

    category:
      data.category ||
      data.product_category ||
      "",

    link: url,
  };

  // Clean up features — remove empty or very short ones
  product.features = product.features
    .filter((f) => f && f.length > 10)
    .slice(0, 6);

  console.log("✅ Cleaned product:", JSON.stringify(product, null, 2));
  return product;
}