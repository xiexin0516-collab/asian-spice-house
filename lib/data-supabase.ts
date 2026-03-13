"use server"

import { getSupabase } from "@/lib/supabase/client"
import type { Cuisine, CuisineInfo, Difficulty, Kit, Recipe, Review, Spice, SpiceCategory } from "@/lib/data"

// ---- 行 → 前端类型 ----
function mapSpiceRow(r: {
  id: string
  slug: string
  name: string
  name_zh: string
  price: number
  image: string | null
  category_slug: string
  description: string | null
  details: string | null
  weight: string | null
  origin: string | null
  ingredients?: string | null
  how_to_use?: string | null
  cuisines: string[]
  in_stock: boolean
  featured: boolean
}): Spice {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameZh: r.name_zh,
    price: Number(r.price),
    image: r.image ?? "",
    category: r.category_slug as SpiceCategory,
    description: r.description ?? "",
    details: r.details ?? "",
    weight: r.weight ?? "",
    origin: r.origin ?? "",
    ingredients: r.ingredients ?? undefined,
    howToUse: r.how_to_use ?? undefined,
    cuisines: (r.cuisines ?? []) as Cuisine[],
    inStock: r.in_stock ?? true,
    featured: r.featured ?? false,
  }
}

function mapKitRow(
  r: {
    id: string
    slug: string
    name: string
    name_zh: string
    price: number
    image: string | null
    description: string | null
    details: string | null
    servings: string | null
    difficulty: string
    estimated_time: string | null
    in_stock: boolean
    featured: boolean
  },
  spiceIds: string[],
  recipeIds: string[]
): Kit {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    nameZh: r.name_zh,
    price: Number(r.price),
    image: r.image ?? "",
    description: r.description ?? "",
    details: r.details ?? "",
    includes: [], // 由 kit_spices 可后续拼出，暂空
    servings: r.servings ?? "",
    difficulty: r.difficulty as Difficulty,
    estimatedTime: r.estimated_time ?? "",
    spiceIds,
    recipeIds,
    cuisines: [], // 若需要可从 kit 关联 recipe 的 cuisine 推，暂空
    inStock: r.in_stock ?? true,
    featured: r.featured ?? false,
  }
}

function mapRecipeRow(
  r: {
    id: string
    slug: string
    title: string
    title_zh: string
    image: string | null
    cook_time: string | null
    servings: number
    cuisine_id: string
    description: string | null
    difficulty: string
    ingredients: unknown
    steps: unknown
    kit_id: string | null
    featured: boolean
  },
  spiceIds: string[]
): Recipe {
  const ingredients = Array.isArray(r.ingredients) ? r.ingredients as string[] : []
  const steps = Array.isArray(r.steps) ? r.steps as string[] : []
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    titleZh: r.title_zh,
    image: r.image ?? "",
    cookTime: r.cook_time ?? "",
    servings: Number(r.servings),
    cuisine: r.cuisine_id as Cuisine,
    description: r.description ?? "",
    difficulty: r.difficulty as Difficulty,
    ingredients,
    steps,
    spiceIds,
    kitId: r.kit_id ?? undefined,
    featured: r.featured ?? false,
  }
}

function mapCuisineRow(r: { id: string; name: string; name_local: string; description: string | null; image: string | null }): CuisineInfo {
  return {
    id: r.id as Cuisine,
    name: r.name,
    nameLocal: r.name_local,
    description: r.description ?? "",
    image: r.image ?? "",
  }
}

// ---- 列表 ----
export async function fetchSpices(): Promise<Spice[]> {
  const { data, error } = await getSupabase().from("spices").select("*").order("id")
  if (error) throw error
  return (data ?? []).map(mapSpiceRow)
}

export async function fetchKits(): Promise<Kit[]> {
  const { data: kits, error: eKits } = await getSupabase().from("kits").select("*").order("id")
  if (eKits) throw eKits
  const { data: kitSpices } = await getSupabase().from("kit_spices").select("kit_id, spice_id")
  const { data: kitRecipes } = await getSupabase().from("kit_recipes").select("kit_id, recipe_id")
  const byKitSpices = new Map<string, string[]>()
  const byKitRecipes = new Map<string, string[]>()
  for (const row of kitSpices ?? []) {
    const arr = byKitSpices.get(row.kit_id) ?? []
    arr.push(row.spice_id)
    byKitSpices.set(row.kit_id, arr)
  }
  for (const row of kitRecipes ?? []) {
    const arr = byKitRecipes.get(row.kit_id) ?? []
    arr.push(row.recipe_id)
    byKitRecipes.set(row.kit_id, arr)
  }
  return (kits ?? []).map((k) => mapKitRow(k, byKitSpices.get(k.id) ?? [], byKitRecipes.get(k.id) ?? []))
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const { data: recipes, error: eRecipes } = await getSupabase().from("recipes").select("*").order("id")
  if (eRecipes) throw eRecipes
  const { data: recipeSpices } = await getSupabase().from("recipe_spices").select("recipe_id, spice_id")
  const byRecipe = new Map<string, string[]>()
  for (const row of recipeSpices ?? []) {
    const arr = byRecipe.get(row.recipe_id) ?? []
    arr.push(row.spice_id)
    byRecipe.set(row.recipe_id, arr)
  }
  return (recipes ?? []).map((r) => mapRecipeRow(r, byRecipe.get(r.id) ?? []))
}

export async function fetchCuisines(): Promise<CuisineInfo[]> {
  const { data, error } = await getSupabase().from("cuisines").select("id, name, name_local, description, image").order("id")
  if (error) throw error
  return (data ?? []).map(mapCuisineRow)
}

// ---- 精选 ----
export async function getFeaturedSpices(): Promise<Spice[]> {
  const { data, error } = await getSupabase().from("spices").select("*").eq("featured", true).order("id")
  if (error) throw error
  return (data ?? []).map(mapSpiceRow)
}

export async function getFeaturedKits(): Promise<Kit[]> {
  const kits = await fetchKits()
  return kits.filter((k) => k.featured)
}

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  const { data, error } = await getSupabase().from("recipes").select("*").eq("featured", true).order("id")
  if (error) throw error
  const { data: recipeSpices } = await getSupabase().from("recipe_spices").select("recipe_id, spice_id")
  const byRecipe = new Map<string, string[]>()
  for (const row of recipeSpices ?? []) {
    const arr = byRecipe.get(row.recipe_id) ?? []
    arr.push(row.spice_id)
    byRecipe.set(row.recipe_id, arr)
  }
  return (data ?? []).map((r) => mapRecipeRow(r, byRecipe.get(r.id) ?? []))
}

// ---- 单条 by id ----
export async function getSpiceById(id: string): Promise<Spice | undefined> {
  const { data, error } = await getSupabase().from("spices").select("*").eq("id", id).single()
  if (error || !data) return undefined
  return mapSpiceRow(data)
}

export async function getSpiceBySlug(slug: string): Promise<Spice | undefined> {
  const { data, error } = await getSupabase().from("spices").select("*").eq("slug", slug).single()
  if (error || !data) return undefined
  return mapSpiceRow(data)
}

export async function getKitById(id: string): Promise<Kit | undefined> {
  const { data: kit, error } = await getSupabase().from("kits").select("*").eq("id", id).single()
  if (error || !kit) return undefined
  const { data: ks } = await getSupabase().from("kit_spices").select("spice_id").eq("kit_id", id)
  const { data: kr } = await getSupabase().from("kit_recipes").select("recipe_id").eq("kit_id", id)
  return mapKitRow(
    kit,
    (ks ?? []).map((r) => r.spice_id),
    (kr ?? []).map((r) => r.recipe_id)
  )
}

export async function getKitBySlug(slug: string): Promise<Kit | undefined> {
  const { data: kit, error } = await getSupabase().from("kits").select("*").eq("slug", slug).single()
  if (error || !kit) return undefined
  const { data: ks } = await getSupabase().from("kit_spices").select("spice_id").eq("kit_id", kit.id)
  const { data: kr } = await getSupabase().from("kit_recipes").select("recipe_id").eq("kit_id", kit.id)
  return mapKitRow(
    kit,
    (ks ?? []).map((r) => r.spice_id),
    (kr ?? []).map((r) => r.recipe_id)
  )
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const { data: recipe, error } = await getSupabase().from("recipes").select("*").eq("id", id).single()
  if (error || !recipe) return undefined
  const { data: rs } = await getSupabase().from("recipe_spices").select("spice_id").eq("recipe_id", id)
  return mapRecipeRow(recipe, (rs ?? []).map((r) => r.spice_id))
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | undefined> {
  const { data: recipe, error } = await getSupabase().from("recipes").select("*").eq("slug", slug).single()
  if (error || !recipe) return undefined
  const { data: rs } = await getSupabase().from("recipe_spices").select("spice_id").eq("recipe_id", recipe.id)
  return mapRecipeRow(recipe, (rs ?? []).map((r) => r.spice_id))
}

// ---- 关联 ----
export async function getSpicesForRecipe(recipeId: string): Promise<Spice[]> {
  const { data: rows } = await getSupabase().from("recipe_spices").select("spice_id").eq("recipe_id", recipeId)
  const ids = (rows ?? []).map((r) => r.spice_id)
  if (ids.length === 0) return []
  const { data, error } = await getSupabase().from("spices").select("*").in("id", ids)
  if (error) return []
  return (data ?? []).map(mapSpiceRow)
}

export async function getRecipesForSpice(spiceId: string): Promise<Recipe[]> {
  const { data: rows } = await getSupabase().from("recipe_spices").select("recipe_id").eq("spice_id", spiceId)
  const ids = (rows ?? []).map((r) => r.recipe_id)
  if (ids.length === 0) return []
  const recipes = await fetchRecipes()
  return recipes.filter((r) => ids.includes(r.id))
}

export async function getSpicesForKit(kitId: string): Promise<Spice[]> {
  const { data: rows } = await getSupabase().from("kit_spices").select("spice_id").eq("kit_id", kitId)
  const ids = (rows ?? []).map((r) => r.spice_id)
  if (ids.length === 0) return []
  const { data, error } = await getSupabase().from("spices").select("*").in("id", ids)
  if (error) return []
  return (data ?? []).map(mapSpiceRow)
}

export async function getRecipesForKit(kitId: string): Promise<Recipe[]> {
  const { data: rows } = await getSupabase().from("kit_recipes").select("recipe_id").eq("kit_id", kitId)
  const ids = (rows ?? []).map((r) => r.recipe_id)
  if (ids.length === 0) return []
  const recipes = await fetchRecipes()
  return recipes.filter((r) => ids.includes(r.id))
}

export async function getSpicesByCuisine(cuisine: Cuisine): Promise<Spice[]> {
  const { data, error } = await getSupabase().from("spices").select("*").contains("cuisines", [cuisine]).order("id")
  if (error) return []
  return (data ?? []).map(mapSpiceRow)
}

export async function getRecipesByCuisine(cuisine: Cuisine): Promise<Recipe[]> {
  const recipes = await fetchRecipes()
  return recipes.filter((r) => r.cuisine === cuisine)
}

export async function getKitsByCuisine(_cuisine: Cuisine): Promise<Kit[]> {
  const kits = await fetchKits()
  return kits
}

// ---- 评论 ----
function mapReviewRow(r: {
  id: string
  product_id: string
  product_type: string
  rating: number
  name: string
  comment: string
  created_at: string
  verified: boolean
}): Review {
  return {
    id: r.id,
    productId: r.product_id,
    productType: r.product_type as "spice" | "kit",
    rating: Number(r.rating),
    name: r.name,
    comment: r.comment,
    createdAt: r.created_at,
    verified: !!r.verified,
  }
}

export async function getReviewsByProduct(
  productId: string,
  productType: "spice" | "kit"
): Promise<Review[]> {
  const { data, error } = await getSupabase()
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("product_type", productType)
    .order("created_at", { ascending: false })
  if (error) return []
  return (data ?? []).map(mapReviewRow)
}

export async function getReviewStats(
  productId: string,
  productType: "spice" | "kit"
): Promise<{ average: number; count: number }> {
  const { data, error } = await getSupabase()
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("product_type", productType)
  if (error || !data || data.length === 0)
    return { average: 0, count: 0 }
  const sum = data.reduce((acc, row) => acc + Number(row.rating), 0)
  return { average: Math.round((sum / data.length) * 10) / 10, count: data.length }
}

export async function createReview(
  productId: string,
  productType: "spice" | "kit",
  rating: number,
  name: string,
  comment: string
): Promise<{ ok: boolean; error?: string }> {
  if (rating < 1 || rating > 5 || !name.trim() || !comment.trim())
    return { ok: false, error: "Invalid input" }
  const { error } = await getSupabase().from("reviews").insert({
    product_id: productId,
    product_type: productType,
    rating,
    name: name.trim(),
    comment: comment.trim(),
    verified: false,
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
