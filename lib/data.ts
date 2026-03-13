// ============================================
// TYPE DEFINITIONS
// ============================================

export type Cuisine = "chinese" | "japanese" | "korean" | "thai" | "vietnamese"
export type SpiceCategory = "whole" | "ground" | "blends"
export type Difficulty = "easy" | "medium" | "hard"

export interface Spice {
  id: string
  slug: string
  name: string           // English name
  nameZh: string         // Chinese name
  price: number
  image: string
  category: SpiceCategory
  description: string
  details: string
  weight: string
  origin: string
  ingredients?: string   // 成分说明（产品页展示）
  howToUse?: string      // 使用说明
  cuisines: Cuisine[]
  inStock: boolean
  featured: boolean
}

export interface Review {
  id: string
  productId: string
  productType: "spice" | "kit"
  rating: number
  name: string
  comment: string
  createdAt: string
  verified: boolean
}

export interface Kit {
  id: string
  slug: string
  name: string           // English name
  nameZh: string         // Chinese name
  price: number
  image: string
  description: string
  details: string
  includes: string[]
  servings: string
  difficulty: Difficulty
  estimatedTime: string
  spiceIds: string[]     // References to spices
  recipeIds: string[]    // References to recipes
  cuisines: Cuisine[]
  inStock: boolean
  featured: boolean
}

export interface Recipe {
  id: string
  slug: string
  title: string          // English title
  titleZh: string        // Chinese title
  image: string
  cookTime: string
  servings: number
  cuisine: Cuisine
  description: string
  difficulty: Difficulty
  ingredients: string[]
  steps: string[]
  spiceIds: string[]     // References to spices
  kitId?: string         // Optional reference to a kit
  featured: boolean
}

export interface Category {
  name: string
  nameZh: string
  slug: string
  description: string
  image: string
}

export interface CuisineInfo {
  id: Cuisine
  name: string
  nameLocal: string
  description: string
  image: string
}

// ============================================
// SPICES DATA (8 items - expandable to 50)
// ============================================

export const spices: Spice[] = [
  {
    id: "star-anise",
    slug: "star-anise",
    name: "Star Anise",
    nameZh: "八角茴香",
    price: 28,
    image: "/images/products/star-anise.jpg",
    category: "whole",
    description: "Premium star anise with rich, sweet aroma. Essential for braising and stewing.",
    details: "Sourced from Guangxi, China. Hand-selected for full, plump pods with deep reddish-brown color. Star anise is a cornerstone of Chinese cuisine, imparting a distinctive licorice-like sweetness to red-braised meats, master stocks, and pho broth.",
    weight: "50g",
    origin: "Guangxi, China",
    cuisines: ["chinese", "vietnamese"],
    inStock: true,
    featured: true,
  },
  {
    id: "sichuan-peppercorn",
    slug: "sichuan-peppercorn",
    name: "Sichuan Peppercorn",
    nameZh: "四川花椒",
    price: 35,
    image: "/images/products/sichuan-peppercorn.jpg",
    category: "whole",
    description: "Authentic Hanyuan peppercorns with intense numbing sensation and citrus notes.",
    details: "From Hanyuan County, Sichuan - the most prized origin for huajiao. These peppercorns deliver the signature 'mala' (numbing-spicy) sensation essential to Sichuan cuisine. Vibrant red color with a clean, lingering tingle.",
    weight: "30g",
    origin: "Sichuan, China",
    cuisines: ["chinese"],
    inStock: true,
    featured: true,
  },
  {
    id: "cinnamon-sticks",
    slug: "cinnamon-sticks",
    name: "Cinnamon Sticks",
    nameZh: "肉桂条",
    price: 32,
    image: "/images/products/cinnamon-sticks.jpg",
    category: "whole",
    description: "Vietnamese cinnamon with sweet, warm fragrance. Perfect for stews and desserts.",
    details: "Premium Vietnamese cassia cinnamon, known for its intense sweetness and bold flavor. Thicker bark with higher oil content than Ceylon varieties. Ideal for pho, braised dishes, and mulled beverages.",
    weight: "40g",
    origin: "Vietnam",
    cuisines: ["chinese", "vietnamese"],
    inStock: true,
    featured: false,
  },
  {
    id: "bay-leaves",
    slug: "bay-leaves",
    name: "Bay Leaves",
    nameZh: "香叶",
    price: 18,
    image: "/images/products/bay-leaves.jpg",
    category: "whole",
    description: "Aromatic dried bay leaves for stews, braises, and sauces.",
    details: "Imported Turkish bay leaves with intact leaves and fresh herbal aroma. Adds subtle depth to slow-cooked dishes, master stocks, and marinades across multiple cuisines.",
    weight: "20g",
    origin: "Turkey",
    cuisines: ["chinese", "vietnamese", "thai"],
    inStock: true,
    featured: false,
  },
  {
    id: "five-spice-powder",
    slug: "five-spice-powder",
    name: "Five Spice Powder",
    nameZh: "五香粉",
    price: 25,
    image: "/images/products/five-spice.jpg",
    category: "ground",
    description: "Traditional blend of five aromatic spices in perfect harmony.",
    details: "A balanced blend of star anise, Sichuan peppercorn, cinnamon, cloves, and fennel seeds. This quintessential Chinese spice mix adds warmth and complexity to roasted meats, marinades, and stir-fries.",
    weight: "50g",
    origin: "House Blend",
    cuisines: ["chinese", "vietnamese"],
    inStock: true,
    featured: true,
  },
  {
    id: "white-pepper-powder",
    slug: "white-pepper-powder",
    name: "White Pepper Powder",
    nameZh: "白胡椒粉",
    price: 38,
    image: "/images/products/white-pepper.jpg",
    category: "ground",
    description: "Hainan white pepper with pure, clean heat. Ideal for soups and seafood.",
    details: "Finely ground Hainan white peppercorns, prized for their sharp yet refined heat. Essential for hot and sour soup, wonton fillings, and Cantonese-style seafood dishes where black pepper would be too visible.",
    weight: "40g",
    origin: "Hainan, China",
    cuisines: ["chinese", "thai", "vietnamese"],
    inStock: true,
    featured: false,
  },
  {
    id: "mala-spice-blend",
    slug: "mala-spice-blend",
    name: "Mala Spice Blend",
    nameZh: "麻辣调味料",
    price: 42,
    image: "/images/products/mala-blend.jpg",
    category: "blends",
    description: "Authentic Sichuan mala seasoning. Numbing, spicy, and deeply savory.",
    details: "A complex blend of Sichuan peppercorns, dried chilies, doubanjiang, and aromatics. Creates the signature 'mala' flavor profile for hot pot, malatang, and dry pot dishes.",
    weight: "150g",
    origin: "Sichuan, China",
    cuisines: ["chinese"],
    inStock: true,
    featured: true,
  },
  {
    id: "char-siu-spice",
    slug: "char-siu-spice",
    name: "Char Siu Spice",
    nameZh: "叉烧调味粉",
    price: 36,
    image: "/images/products/bbq-spice.jpg",
    category: "blends",
    description: "Hong Kong-style BBQ spice blend. Sweet, savory, and aromatic.",
    details: "Our signature char siu blend combines five-spice, fermented red bean curd essence, honey powder, and aromatics. Simply marinate and roast for restaurant-quality Cantonese BBQ pork at home.",
    weight: "100g",
    origin: "House Blend",
    cuisines: ["chinese"],
    inStock: true,
    featured: false,
  },
]

// ============================================
// COOKING KITS DATA (4 items - expandable to 10)
// ============================================

export const kits: Kit[] = [
  {
    id: "hotpot-kit",
    slug: "hot-pot-spice-kit",
    name: "Hot Pot Spice Kit",
    nameZh: "火锅香料套装",
    price: 88,
    image: "/images/kits/hotpot-kit.jpg",
    description: "Complete hot pot spice set with all essential aromatics and seasonings.",
    details: "Everything you need for an authentic Sichuan hot pot experience at home. Includes premium dried chilies, Sichuan peppercorns, and our signature spice blend. Detailed recipe card included.",
    includes: [
      "Sichuan Peppercorn 30g",
      "Dried Chilies 50g",
      "Star Anise 20g",
      "Cinnamon Sticks 15g",
      "Cao Guo (Black Cardamom) 3pcs",
      "Bay Leaves 10g",
      "Doubanjiang 200g"
    ],
    servings: "Serves 4-6",
    difficulty: "medium",
    estimatedTime: "45 min",
    spiceIds: ["sichuan-peppercorn", "star-anise", "cinnamon-sticks", "bay-leaves"],
    recipeIds: ["sichuan-hot-pot"],
    cuisines: ["chinese"],
    inStock: true,
    featured: true,
  },
  {
    id: "braised-pork-kit",
    slug: "braised-pork-spice-kit",
    name: "Braised Pork Spice Kit",
    nameZh: "红烧肉香料套装",
    price: 68,
    image: "/images/kits/braised-pork-kit.jpg",
    description: "Classic red-braised pork spice set for rich, caramelized flavor.",
    details: "The essential spices for Shanghai-style hong shao rou. Pre-portioned and ready to use. One kit makes enough for 1-1.5kg of pork belly.",
    includes: [
      "Star Anise 15g",
      "Cinnamon Sticks 10g",
      "Bay Leaves 5g",
      "Dried Chilies 10g",
      "Rock Sugar 100g",
      "Dark Soy Sauce 50ml",
      "Shaoxing Wine 100ml"
    ],
    servings: "Serves 4-6",
    difficulty: "medium",
    estimatedTime: "90 min",
    spiceIds: ["star-anise", "cinnamon-sticks", "bay-leaves"],
    recipeIds: ["braised-pork-belly"],
    cuisines: ["chinese"],
    inStock: true,
    featured: true,
  },
  {
    id: "mapo-tofu-kit",
    slug: "mapo-tofu-spice-kit",
    name: "Mapo Tofu Spice Kit",
    nameZh: "麻婆豆腐调味套装",
    price: 45,
    image: "/images/kits/mapo-tofu-kit.jpg",
    description: "Authentic Sichuan mapo tofu seasoning. Numbing, spicy perfection.",
    details: "Restaurant-quality mapo tofu at home. Includes Pixian doubanjiang, ground Sichuan peppercorn, and our signature chili oil blend.",
    includes: [
      "Pixian Doubanjiang 50g",
      "Sichuan Peppercorn Powder 10g",
      "Chili Flakes 15g",
      "Fermented Black Beans 20g",
      "Sichuan Chili Oil 30ml"
    ],
    servings: "Serves 2-3",
    difficulty: "easy",
    estimatedTime: "20 min",
    spiceIds: ["sichuan-peppercorn", "mala-spice-blend"],
    recipeIds: ["mapo-tofu"],
    cuisines: ["chinese"],
    inStock: true,
    featured: true,
  },
  {
    id: "kung-pao-kit",
    slug: "kung-pao-chicken-kit",
    name: "Kung Pao Chicken Kit",
    nameZh: "宫保鸡丁调味套装",
    price: 52,
    image: "/images/kits/hotpot-kit.jpg", // Placeholder - reusing existing image
    description: "Classic Sichuan kung pao seasoning with dried chilies and peppercorns.",
    details: "All the spices and sauces needed for authentic kung pao chicken. Just add chicken, peanuts, and vegetables.",
    includes: [
      "Dried Facing-Heaven Chilies 30g",
      "Sichuan Peppercorns 15g",
      "Kung Pao Sauce Blend 80ml",
      "Roasted Peanuts 50g"
    ],
    servings: "Serves 3-4",
    difficulty: "easy",
    estimatedTime: "25 min",
    spiceIds: ["sichuan-peppercorn"],
    recipeIds: ["kung-pao-chicken"],
    cuisines: ["chinese"],
    inStock: true,
    featured: false,
  },
]

// ============================================
// RECIPES DATA (4 items - expandable to 40)
// ============================================

export const recipes: Recipe[] = [
  {
    id: "kung-pao-chicken",
    slug: "kung-pao-chicken",
    title: "Kung Pao Chicken",
    titleZh: "宫保鸡丁",
    image: "/images/recipes/kung-pao-chicken.jpg",
    cookTime: "30 min",
    servings: 4,
    cuisine: "chinese",
    description: "Classic Sichuan stir-fry with tender chicken, crunchy peanuts, and the signature mala tingle.",
    difficulty: "medium",
    ingredients: [
      "300g chicken breast, diced",
      "50g roasted peanuts",
      "10 dried red chilies",
      "1 tsp Sichuan peppercorns",
      "3 cloves garlic, minced",
      "1 inch ginger, minced",
      "2 tbsp soy sauce",
      "1 tbsp Chinkiang vinegar",
      "1 tbsp sugar"
    ],
    steps: [
      "Marinate diced chicken with 1 tbsp soy sauce, 1 tsp cornstarch, and a splash of Shaoxing wine for 15 minutes.",
      "Toast peanuts in a dry wok until fragrant. Set aside.",
      "Heat oil over medium heat. Add dried chilies and Sichuan peppercorns, fry until fragrant (about 30 seconds). Remove peppercorns.",
      "Turn heat to high. Add chicken and stir-fry until just cooked through, about 3-4 minutes.",
      "Add garlic and ginger, stir-fry for 30 seconds.",
      "Pour in the sauce (remaining soy sauce, vinegar, sugar, and a splash of water). Toss to coat.",
      "Add peanuts, give a final toss, and serve immediately over rice."
    ],
    spiceIds: ["sichuan-peppercorn"],
    kitId: "kung-pao-kit",
    featured: true,
  },
  {
    id: "braised-pork-belly",
    slug: "red-braised-pork-belly",
    title: "Red Braised Pork Belly",
    titleZh: "红烧肉",
    image: "/images/recipes/braised-pork.jpg",
    cookTime: "90 min",
    servings: 6,
    cuisine: "chinese",
    description: "Melt-in-your-mouth pork belly in a rich, caramelized soy glaze. The ultimate comfort food.",
    difficulty: "medium",
    ingredients: [
      "500g pork belly, cut into 3cm cubes",
      "30g rock sugar",
      "2 star anise",
      "1 cinnamon stick",
      "3 bay leaves",
      "3 tbsp light soy sauce",
      "1 tbsp dark soy sauce",
      "2 tbsp Shaoxing wine"
    ],
    steps: [
      "Blanch pork belly in boiling water for 3 minutes to remove impurities. Drain and rinse.",
      "In a dry wok or pot, melt rock sugar over low heat until it turns amber.",
      "Add pork belly and toss to coat in caramel. The sugar will harden then melt again.",
      "Add star anise, cinnamon, bay leaves, both soy sauces, and Shaoxing wine.",
      "Add enough hot water to just cover the pork. Bring to a boil.",
      "Reduce heat to low, cover, and simmer for 60-90 minutes until pork is tender.",
      "Uncover and increase heat to reduce sauce until glossy and coating the meat."
    ],
    spiceIds: ["star-anise", "cinnamon-sticks", "bay-leaves"],
    kitId: "braised-pork-kit",
    featured: true,
  },
  {
    id: "mapo-tofu",
    slug: "mapo-tofu",
    title: "Mapo Tofu",
    titleZh: "麻婆豆腐",
    image: "/images/recipes/mapo-tofu.jpg",
    cookTime: "20 min",
    servings: 4,
    cuisine: "chinese",
    description: "Silky tofu in a fiery, numbing sauce. The definitive Sichuan comfort dish.",
    difficulty: "easy",
    ingredients: [
      "400g soft tofu, cut into 2cm cubes",
      "100g ground pork",
      "2 tbsp Pixian doubanjiang",
      "1 tsp Sichuan peppercorn powder",
      "2 cloves garlic, minced",
      "1 tbsp soy sauce",
      "1 tsp cornstarch mixed with 2 tbsp water",
      "2 green onions, chopped"
    ],
    steps: [
      "Gently blanch tofu cubes in salted water for 2 minutes. This helps them hold shape. Drain carefully.",
      "Heat oil in a wok over medium heat. Add ground pork and stir-fry until browned.",
      "Push pork to the side, add doubanjiang to the oil and fry until the oil turns red.",
      "Add garlic and stir briefly, then add 1 cup water and soy sauce. Bring to a simmer.",
      "Gently slide in the tofu. Simmer for 3-5 minutes, gently stirring occasionally.",
      "Drizzle in cornstarch slurry while gently stirring. Cook until sauce thickens.",
      "Transfer to a serving bowl, sprinkle generously with Sichuan peppercorn powder and green onions."
    ],
    spiceIds: ["sichuan-peppercorn", "mala-spice-blend"],
    kitId: "mapo-tofu-kit",
    featured: true,
  },
  {
    id: "sichuan-hot-pot",
    slug: "sichuan-hot-pot",
    title: "Sichuan Hot Pot",
    titleZh: "四川火锅",
    image: "/images/dishes/hotpot-premium.jpg",
    cookTime: "45 min",
    servings: 6,
    cuisine: "chinese",
    description: "The ultimate communal dining experience. Bubbling, spicy broth for cooking fresh ingredients.",
    difficulty: "medium",
    ingredients: [
      "2L beef or chicken stock",
      "100g beef tallow or vegetable oil",
      "50g Pixian doubanjiang",
      "30g dried chilies",
      "20g Sichuan peppercorns",
      "5 star anise",
      "2 cinnamon sticks",
      "1 cao guo (black cardamom)",
      "Ginger, garlic, green onions"
    ],
    steps: [
      "Heat tallow/oil in a large pot. Add doubanjiang and fry until oil turns red.",
      "Add dried chilies and Sichuan peppercorns, fry for 1 minute until fragrant.",
      "Add remaining whole spices, ginger, garlic. Fry another minute.",
      "Pour in stock, bring to a boil, then simmer for 20 minutes to develop flavor.",
      "Strain if desired for a cleaner broth, or leave spices in for more intensity.",
      "Transfer to a hot pot burner at the table. Prepare dipping sauces (sesame oil, garlic, cilantro).",
      "Add your choice of thinly sliced meats, vegetables, tofu, and noodles to cook in the bubbling broth."
    ],
    spiceIds: ["sichuan-peppercorn", "star-anise", "cinnamon-sticks", "bay-leaves", "mala-spice-blend"],
    kitId: "hotpot-kit",
    featured: false,
  },
]

// ============================================
// CATEGORIES
// ============================================

export const categories: Category[] = [
  {
    name: "Whole Spices",
    nameZh: "整香料",
    slug: "whole",
    description: "Unground spices in their natural form",
    image: "/images/categories/whole-spices.jpg",
  },
  {
    name: "Ground Spices",
    nameZh: "研磨香料",
    slug: "ground",
    description: "Finely ground for convenience",
    image: "/images/categories/ground-spices.jpg",
  },
  {
    name: "Spice Blends",
    nameZh: "调味料",
    slug: "blends",
    description: "Expertly crafted spice combinations",
    image: "/images/categories/spice-blends.jpg",
  },
  {
    name: "Cooking Kits",
    nameZh: "烹饪套装",
    slug: "kits",
    description: "Complete meal solutions",
    image: "/images/categories/cooking-kits.jpg",
  },
]

// ============================================
// CUISINES
// ============================================

export const cuisines: CuisineInfo[] = [
  {
    id: "chinese",
    name: "Chinese",
    nameLocal: "中国菜",
    description: "From fiery Sichuan to delicate Cantonese",
    image: "/images/cuisines/chinese.jpg",
  },
  {
    id: "japanese",
    name: "Japanese",
    nameLocal: "日本料理",
    description: "Subtle umami and refined simplicity",
    image: "/images/cuisines/japanese.jpg",
  },
  {
    id: "korean",
    name: "Korean",
    nameLocal: "한국 요리",
    description: "Bold fermented flavors and heat",
    image: "/images/cuisines/korean.jpg",
  },
  {
    id: "thai",
    name: "Thai",
    nameLocal: "อาหารไทย",
    description: "Sweet, sour, salty, spicy harmony",
    image: "/images/cuisines/thai.jpg",
  },
  {
    id: "vietnamese",
    name: "Vietnamese",
    nameLocal: "Ẩm thực Việt",
    description: "Fresh herbs and aromatic broths",
    image: "/images/cuisines/vietnamese.jpg",
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSpiceById(id: string): Spice | undefined {
  return spices.find(s => s.id === id)
}

export function getSpiceBySlug(slug: string): Spice | undefined {
  return spices.find(s => s.slug === slug)
}

export function getKitById(id: string): Kit | undefined {
  return kits.find(k => k.id === id)
}

export function getKitBySlug(slug: string): Kit | undefined {
  return kits.find(k => k.slug === slug)
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find(r => r.id === id)
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find(r => r.slug === slug)
}

export function getSpicesByCuisine(cuisine: Cuisine): Spice[] {
  return spices.filter(s => s.cuisines.includes(cuisine))
}

export function getKitsByCuisine(cuisine: Cuisine): Kit[] {
  return kits.filter(k => k.cuisines.includes(cuisine))
}

export function getRecipesByCuisine(cuisine: Cuisine): Recipe[] {
  return recipes.filter(r => r.cuisine === cuisine)
}

export function getSpicesForRecipe(recipeId: string): Spice[] {
  const recipe = getRecipeById(recipeId)
  if (!recipe) return []
  return recipe.spiceIds.map(id => getSpiceById(id)).filter((s): s is Spice => s !== undefined)
}

export function getRecipesForSpice(spiceId: string): Recipe[] {
  return recipes.filter(r => r.spiceIds.includes(spiceId))
}

export function getSpicesForKit(kitId: string): Spice[] {
  const kit = getKitById(kitId)
  if (!kit) return []
  return kit.spiceIds.map(id => getSpiceById(id)).filter((s): s is Spice => s !== undefined)
}

export function getRecipesForKit(kitId: string): Recipe[] {
  const kit = getKitById(kitId)
  if (!kit) return []
  return kit.recipeIds.map(id => getRecipeById(id)).filter((r): r is Recipe => r !== undefined)
}

export function getFeaturedSpices(): Spice[] {
  return spices.filter(s => s.featured)
}

export function getFeaturedKits(): Kit[] {
  return kits.filter(k => k.featured)
}

export function getFeaturedRecipes(): Recipe[] {
  return recipes.filter(r => r.featured)
}
