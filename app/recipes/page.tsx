import { fetchRecipes, fetchCuisines, getSpicesForRecipe } from "@/lib/data-supabase"
import { RecipesClient } from "./RecipesClient"

export default async function RecipesPage() {
  const [recipes, cuisines] = await Promise.all([fetchRecipes(), fetchCuisines()])
  const spiceNamesByRecipeId: Record<string, string> = {}
  await Promise.all(
    recipes.map(async (r) => {
      const spices = await getSpicesForRecipe(r.id)
      spiceNamesByRecipeId[r.id] = spices.slice(0, 3).map((s) => s.name).join(", ")
    })
  )
  return (
    <RecipesClient
      recipes={recipes}
      cuisines={cuisines}
      spiceNamesByRecipeId={spiceNamesByRecipeId}
    />
  )
}
