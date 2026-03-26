import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Leaf, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { AddToCart } from "@/components/add-to-cart"
import { categories } from "@/lib/data"
import { ProductReviews, Stars } from "@/components/product-reviews"
import { getSpiceBySlug, getRecipesForSpice, getSpicesByCuisine, fetchSpices, fetchCuisines, getReviewsByProduct, getReviewStats } from "@/lib/data-supabase"

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const spices = await fetchSpices()
  return spices.map((spice) => ({ slug: spice.slug }))
}

export default async function SpiceDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const [spice, cuisines] = await Promise.all([getSpiceBySlug(slug), fetchCuisines()])
  if (!spice) notFound()

  const displayWeight = /^\d+$/.test(spice.weight) ? `${spice.weight}g` : spice.weight

  const [relatedRecipes, relatedSpicesByCuisine, reviews, reviewStats] = await Promise.all([
    getRecipesForSpice(spice.id).then((r) => r.slice(0, 3)),
    Promise.all(spice.cuisines.map((c) => getSpicesByCuisine(c))).then((arr) =>
      arr.flat().filter((s) => s.id !== spice.id).filter((s, i, a) => a.findIndex((x) => x.id === s.id) === i).slice(0, 4)
    ),
    getReviewsByProduct(spice.id, "spice"),
    getReviewStats(spice.id, "spice"),
  ])
  const category = categories.find((c) => c.slug === spice.category)
  const spiceCuisines = cuisines.filter((c) => spice.cuisines.includes(c.id))
  const relatedSpices = relatedSpicesByCuisine

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </nav>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden bg-secondary">
              <Image
                src={spice.image}
                alt={spice.name}
                width={800}
                height={800}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category & Cuisines */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-muted-foreground uppercase tracking-wide">
                  {category?.name || spice.category}
                </span>
                <span className="text-border">|</span>
                {spiceCuisines.map((cuisine, i) => (
                  <span key={cuisine.id} className="text-muted-foreground">
                    {cuisine.name}{i < spiceCuisines.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
                {spice.name}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">{spice.nameZh}</p>

              {/* Price, Rating & Stock */}
              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-3xl font-medium text-foreground">
                  ${spice.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {displayWeight}
                </span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Stars value={reviewStats.average} size="sm" />
                  <span className="text-sm font-medium text-foreground">
                    {reviewStats.average > 0 ? reviewStats.average.toFixed(1) : "—"}
                  </span>
                  <span className="text-sm">
                    ({reviewStats.count} {reviewStats.count === 1 ? "review" : "reviews"})
                  </span>
                </div>
                {spice.inStock ? (
                  <span className="ml-auto text-sm text-green-600">In Stock</span>
                ) : (
                  <span className="ml-auto text-sm text-destructive">Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <p className="mt-8 text-muted-foreground leading-relaxed">
                {spice.description}
              </p>

              {/* Product Details */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Origin</p>
                    <p className="text-foreground font-medium">{spice.origin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Shelf Life</p>
                    <p className="text-foreground font-medium">24 months</p>
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart (shared component) */}
              <AddToCart
                id={spice.id}
                type="spice"
                name={spice.name}
                nameZh={spice.nameZh}
                price={spice.price}
                image={spice.image}
                slug={spice.slug}
                inStock={spice.inStock}
              />

              {/* Trust (same as product page) */}
              <ul className="mt-10 space-y-2 text-sm text-muted-foreground border-t border-border pt-8">
                <li className="flex items-center gap-2">
                  <span className="text-foreground/70">✓</span> Secure checkout
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-foreground/70">✓</span> Free shipping over $50
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-foreground/70">✓</span> Premium sourced spices
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-foreground/70">✓</span> 30-day satisfaction guarantee
                </li>
              </ul>
            </div>
          </div>

          {/* Reviews */}
          <ProductReviews
            productId={spice.id}
            productType="spice"
            initialReviews={reviews}
            initialStats={reviewStats}
          />

          {/* Recipes Using This Spice */}
          {relatedRecipes.length > 0 && (
            <section className="mt-24 border-t border-border pt-16">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Cook With This
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                    Recipes Using {spice.name}
                  </h2>
                </div>
                <Link 
                  href={`/recipes?spice=${spice.slug}`}
                  className="hidden md:flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View All Recipes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedRecipes.map((recipe) => (
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
                    <div className="mt-4">
                      <h3 className="font-serif text-xl text-foreground group-hover:text-muted-foreground transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {recipe.titleZh}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{recipe.cookTime}</span>
                        <span>Serves {recipe.servings}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Spices */}
          {relatedSpices.length > 0 && (
            <section className="mt-24 border-t border-border pt-16">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                    Complete Your Pantry
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                    Related Spices
                  </h2>
                </div>
                <Link 
                  href="/shop"
                  className="hidden md:flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shop All Spices
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {relatedSpices.map((item) => (
                  <Link
                    key={item.id}
                    href={`/spice/${item.slug}`}
                    className="group"
                  >
                    <div className="aspect-square overflow-hidden bg-secondary">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {categories.find(c => c.slug === item.category)?.name || item.category}
                      </p>
                      <h3 className="font-serif text-lg text-foreground group-hover:text-muted-foreground transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
