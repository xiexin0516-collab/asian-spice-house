"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { Clock, Users, ArrowRight } from "lucide-react"
import type { CuisineInfo, Recipe } from "@/lib/data"
import { SubscribeForm } from "@/components/subscribe-form"

function CuisineFromQuery({ onCuisine }: { onCuisine: (cuisine: string) => void }) {
  const searchParams = useSearchParams()
  const cuisineParam = searchParams.get("cuisine") ?? "all"
  useEffect(() => {
    onCuisine(cuisineParam)
  }, [cuisineParam, onCuisine])
  return null
}

export function RecipesClient({
  recipes,
  cuisines,
  spiceNamesByRecipeId,
}: {
  recipes: Recipe[]
  cuisines: CuisineInfo[]
  spiceNamesByRecipeId: Record<string, string>
}) {
  const [activeCuisine, setActiveCuisine] = useState("all")

  const cuisineFilters = [
    { name: "All", slug: "all" },
    ...cuisines.map((c) => ({ name: c.name, slug: c.id })),
  ]
  const filteredRecipes = useMemo(() => {
    if (activeCuisine === "all") return recipes
    return recipes.filter((r) => r.cuisine === activeCuisine)
  }, [activeCuisine, recipes])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Suspense fallback={null}>
        <CuisineFromQuery onCuisine={setActiveCuisine} />
      </Suspense>

      <main className="flex-1">
        <section className="bg-secondary py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
              From Our Kitchen
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">
              Recipes
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Explore authentic Asian recipes using our premium spices, from simple weeknight dinners to impressive feasts
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 border-b border-border pb-8">
              {cuisineFilters.map((cuisine) => (
                <button
                  key={cuisine.slug}
                  onClick={() => setActiveCuisine(cuisine.slug)}
                  className={cn(
                    "px-5 py-2 text-sm tracking-wide transition-colors",
                    activeCuisine === cuisine.slug
                      ? "bg-foreground text-background"
                      : "bg-transparent text-muted-foreground hover:text-foreground border border-border"
                  )}
                >
                  {cuisine.name}
                </button>
              ))}
            </div>

            <div className="mt-12">
              {filteredRecipes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recipes available.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-8">
                    Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? "recipe" : "recipes"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRecipes.map((recipe) => (
                      <Link
                        key={recipe.id}
                        href={`/recipe/${recipe.slug}`}
                        className="group"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-muted">
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            width={600}
                            height={450}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-5">
                          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">
                            {cuisines.find((c) => c.id === recipe.cuisine)?.name || recipe.cuisine}
                          </p>
                          <h3 className="font-serif text-xl text-foreground group-hover:text-muted-foreground transition-colors">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {recipe.titleZh}
                          </p>
                          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {recipe.cookTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="h-4 w-4" />
                              Serves {recipe.servings}
                            </span>
                          </div>
                          {recipe.spiceIds.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Uses</p>
                              <p className="text-sm text-foreground">
                                {spiceNamesByRecipeId[recipe.id] ?? ""}
                                {recipe.spiceIds.length > 3 && ` +${recipe.spiceIds.length - 3} more`}
                              </p>
                            </div>
                          )}
                          <div className="mt-4 flex items-center text-sm text-accent group-hover:text-accent/80 transition-colors">
                            <span>View Recipe</span>
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24 bg-secondary">
          <div className="mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
              Stay Inspired
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              Get More Recipe Ideas
            </h2>
            <p className="mt-6 text-muted-foreground">
              Subscribe to receive new recipes and cooking tips every week
            </p>
            <SubscribeForm variant="outline" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
