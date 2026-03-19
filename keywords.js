// keywords.js

// ── Keyword database per category ────────────────────────
const keywordDatabase = {
  earbuds: {
    primary: ["wireless earbuds", "bluetooth earbuds", "noise cancelling earbuds"],
    secondary: ["earbuds under 2000", "best budget earbuds india", "earbuds for gym"],
    india: ["earbuds amazon india", "boat earbuds", "earbuds flipkart india"],
    intent: ["buy earbuds online india", "best earbuds 2024 india"],
  },
  headphones: {
    primary: ["wireless headphones", "bluetooth headphones", "over ear headphones"],
    secondary: ["headphones under 2000", "best headphones india", "headphones for music"],
    india: ["headphones amazon india", "sony headphones india", "boat headphones india"],
    intent: ["buy headphones online india", "best headphones 2024"],
  },
  skincare: {
    primary: ["skincare routine", "skincare products india", "face serum"],
    secondary: ["skincare for beginners", "affordable skincare india", "glowing skin routine"],
    india: ["skincare amazon india", "minimalist skincare", "dermatologist recommended india"],
    intent: ["best skincare products india", "skincare tips 2024"],
  },
  perfume: {
    primary: ["perfume women india", "body spray", "long lasting fragrance"],
    secondary: ["affordable perfume india", "perfume under 500", "best deodorant women india"],
    india: ["perfume amazon india", "body spray india", "fragrance india"],
    intent: ["best perfume for women india", "buy perfume online india"],
  },
  shoes: {
    primary: ["sneakers india", "running shoes india", "casual shoes"],
    secondary: ["shoes under 2000 india", "best running shoes india", "comfortable shoes"],
    india: ["shoes amazon india", "nike india", "puma shoes india"],
    intent: ["buy shoes online india", "best sneakers 2024 india"],
  },
  phone: {
    primary: ["smartphone india", "android phone", "budget smartphone india"],
    secondary: ["phone under 15000", "best camera phone india", "5G phone india"],
    india: ["mobile phones india", "redmi india", "samsung india"],
    intent: ["buy smartphone india", "best phone under 10000 india"],
  },
  laptop: {
    primary: ["laptop india", "student laptop", "budget laptop india"],
    secondary: ["laptop under 50000", "best laptop india 2024", "gaming laptop india"],
    india: ["laptop amazon india", "lenovo india", "hp laptop india"],
    intent: ["buy laptop online india", "best laptop for students india"],
  },
  watch: {
    primary: ["smartwatch india", "fitness tracker india", "smart band"],
    secondary: ["smartwatch under 3000", "best smartwatch india", "fitness watch india"],
    india: ["smartwatch amazon india", "noise smartwatch", "boat smartwatch india"],
    intent: ["buy smartwatch india", "best smartwatch 2024 india"],
  },
  fashion: {
    primary: ["indian fashion", "women kurta", "ethnic wear india"],
    secondary: ["kurta under 500", "party wear dress india", "casual wear women india"],
    india: ["fashion amazon india", "ethnic wear india", "myntra fashion india"],
    intent: ["buy kurta online india", "best ethnic wear 2024"],
  },
  kitchen: {
    primary: ["kitchen gadgets india", "cookware india", "kitchen appliances india"],
    secondary: ["kitchen tools under 500", "best cookware india", "kitchen accessories"],
    india: ["kitchen amazon india", "prestige cookware india", "kitchen gadgets india"],
    intent: ["buy kitchen gadgets india", "best kitchen tools 2024"],
  },
  bag: {
    primary: ["bags india", "backpack india", "handbag"],
    secondary: ["bags under 1000 india", "college backpack india", "ladies handbag india"],
    india: ["bags amazon india", "fastrack bags india", "wildcraft backpack"],
    intent: ["buy bags online india", "best backpack 2024 india"],
  },
  beauty: {
    primary: ["makeup india", "beauty products india", "lipstick india"],
    secondary: ["affordable makeup india", "beauty under 500", "drugstore makeup india"],
    india: ["beauty amazon india", "lakme india", "myntra beauty india"],
    intent: ["buy makeup online india", "best beauty products 2024 india"],
  },
};

// ── Detect category from product title ───────────────────
export function detectCategory(title) {
  const t = title.toLowerCase();
  if (/earbu|earpod|airpod/i.test(t))                          return "earbuds";
  if (/headphone|headset/i.test(t))                            return "headphones";
  if (/serum|moisturizer|sunscreen|face wash|toner|skincare/i.test(t)) return "skincare";
  if (/perfume|deodorant|fragrance|body spray|deo/i.test(t))  return "perfume";
  if (/shoe|sneaker|boot|sandal|footwear/i.test(t))            return "shoes";
  if (/phone|mobile|smartphone|iphone|samsung|redmi|oneplus/i.test(t)) return "phone";
  if (/laptop|macbook|notebook|chromebook/i.test(t))           return "laptop";
  if (/watch|smartwatch|fitbit|band|tracker/i.test(t))         return "watch";
  if (/kurta|saree|lehenga|dress|shirt|fashion|clothing/i.test(t)) return "fashion";
  if (/kitchen|cookware|utensil|mixer|grinder|pressure cooker/i.test(t)) return "kitchen";
  if (/bag|backpack|purse|handbag|tote/i.test(t))              return "bag";
  if (/lipstick|mascara|foundation|makeup|kajal|eyeliner/i.test(t)) return "beauty";
  return null;
}

// ── Get keywords for a product ────────────────────────────
export function getKeywords(title) {
  const category = detectCategory(title);

  if (!category || !keywordDatabase[category]) {
    // Generic fallback keywords
    return [
      "amazon deals india",
      "online shopping india",
      "best products india",
      "must have products",
      "amazon india sale",
    ];
  }

  const db = keywordDatabase[category];
  return [
    ...db.primary.slice(0, 2),
    ...db.secondary.slice(0, 2),
    ...db.india.slice(0, 1),
    ...db.intent.slice(0, 1),
  ];
}