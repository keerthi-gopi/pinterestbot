// scraper.js
export async function scrapeAmazonProduct(url) {
  console.log("🔍 Fetching:", url);

  const apiUrl = `https://api.scrapingdog.com/amazon/product?api_key=${process.env.SCRAPINGDOG_API_KEY}&url=${encodeURIComponent(url)}&country=in`;

  const res = await fetch(apiUrl);

  if (!res.ok) throw new Error(`Scrapingdog failed: ${res.status}`);

  const data = await res.json();
  console.log("📦 Raw data:", JSON.stringify(data, null, 2));

  // Scrapingdog returns clean structured JSON directly
  const product = {
    title: data.title || data.product_title || "",
    price: data.price || data.product_price || "Check on Amazon",
    rating: data.average_rating || data.rating || "",
    reviewCount: data.total_reviews || data.reviews_count || "",
    image: data.images?.[0] || data.product_image || data.main_image || "",
    features: data.feature_bullets || data.features || [],
    brand: data.brand || data.product_brand || "",
    description: data.product_description || "",
    link: url,
  };

  console.log("✅ PRODUCT:\n", JSON.stringify(product, null, 2));
  return product;
}