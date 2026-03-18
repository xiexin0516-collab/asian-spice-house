"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import type { Category, Spice } from "@/lib/data"

const categoryFiltersFromCategories = (categories: Category[]) => [
  { name: "All", slug: "all" },
  ...categories.filter((c) => c.slug !== "kits"),
]

function CategoryFromQuery({ onCategory }: { onCategory: (category: string) => void }) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category") ?? "all"
  useEffect(() => {
    onCategory(categoryParam)
  }, [categoryParam, onCategory])
  return null
}

export function ShopClient({
  spices,
  categories,
  loadError = false,
}: {
  spices: Spice[]
  categories: Category[]
  loadError?: boolean
}) {
  const [activeCategory, setActiveCategory] = useState("all")

  const categoryFilters = categoryFiltersFromCategories(categories)
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return spices
    return spices.filter((p) => p.category === activeCategory)
  }, [activeCategory, spices])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Suspense fallback={null}>
        <CategoryFromQuery onCategory={setActiveCategory} />
      </Suspense>

      <main className="flex-1">
        <section className="bg-secondary py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
              Shop
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">
              Spice Collection
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Explore our curated selection of premium Asian spices to elevate your cooking
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 border-b border-border pb-8">
              {categoryFilters.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setActiveCategory(category.slug)}
                  className={cn(
                    "px-5 py-2 text-sm tracking-wide transition-colors",
                    activeCategory === category.slug
                      ? "bg-foreground text-background"
                      : "bg-transparent text-muted-foreground hover:text-foreground border border-border"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="mt-12">
              {loadError ? (
                <p className="text-sm text-destructive">
                  Something went wrong loading products. Please try again.
                </p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No products available.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-8">
                    Showing {filteredProducts.length} products
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/spice/${product.slug}`}
                        className="group"
                      >
                        <div className="aspect-square overflow-hidden bg-secondary mb-5">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">
                            {categories.find(c => c.slug === product.category)?.name || product.category}
                          </p>
                          <h3 className="font-serif text-lg text-foreground group-hover:text-muted-foreground transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {product.nameZh}
                          </p>
                          <p className="text-sm text-foreground mt-2">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
