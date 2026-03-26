import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getKitBySlug, getSpicesForKit, getRecipesForKit, fetchKits, fetchCuisines } from "@/lib/data-supabase"
import { Clock, Users, ChefHat, Check, ShoppingCart, ArrowRight, ArrowLeft, Package } from "lucide-react"

export async function generateStaticParams() {
  const kits = await fetchKits()
  return kits.map((kit) => ({ slug: kit.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const kit = await getKitBySlug(slug)
  if (!kit) return { title: "Kit Not Found" }
  return {
    title: `${kit.name} | Asian Spice House`,
    description: kit.description,
  }
}

export default async function KitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [kit, cuisines] = await Promise.all([getKitBySlug(slug), fetchCuisines()])
  if (!kit) notFound()

  const [kitSpices, kitRecipes, allKits] = await Promise.all([
    getSpicesForKit(kit.id),
    getRecipesForKit(kit.id),
    fetchKits(),
  ])
  const cuisineInfo = kit.cuisines.length ? cuisines.find((c) => kit.cuisines.includes(c.id)) : null
  const otherKits = allKits.filter((k) => k.id !== kit.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8">
          <Link 
            href="/cooking-kits" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cooking Kits
          </Link>
        </div>

        {/* Hero Section */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Kit Image */}
              <div className="aspect-square overflow-hidden bg-muted">
                <Image
                  src={kit.image}
                  alt={kit.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              {/* Kit Info */}
              <div className="flex flex-col justify-center">
                <p className="text-sm text-muted-foreground tracking-[0.15em] uppercase mb-3">
                  {cuisineInfo?.name || "Asian"} Cooking Kit
                </p>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
                  {kit.name}
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  {kit.nameZh}
                </p>

                {/* Meta Info */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {kit.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {kit.servings}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ChefHat className="h-4 w-4" />
                    {kit.difficulty.charAt(0).toUpperCase() + kit.difficulty.slice(1)}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-8">
                  <p className="text-3xl font-medium text-foreground">
                    ${kit.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {kit.inStock ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  {kit.description}
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {kit.details}
                </p>

                {/* Add to Cart */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="h-12 px-8" disabled={!kit.inStock}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  {kitRecipes.length > 0 && (
                    <Button variant="outline" size="lg" className="h-12 px-8" asChild>
                      <Link href={`/recipe/${kitRecipes[0].slug}`}>
                        View Recipe
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 lg:py-20 bg-secondary">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Included Items List */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-5 w-5 text-accent" />
                  <h2 className="font-serif text-2xl text-foreground">
                    {"What's Included"}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {kitSpices.length === 0 ? (
                    <li className="text-sm text-muted-foreground">
                      Included items will be listed soon.
                    </li>
                  ) : (
                    kitSpices.map((spice) => (
                      <li key={spice.id} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">
                          {spice.name}{" "}
                          <span className="text-muted-foreground">
                            ({spice.weight ? (/^\d+$/.test(spice.weight) ? `${spice.weight}g` : spice.weight) : "250g"})
                          </span>
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Key Spices */}
              {kitSpices.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl text-foreground mb-6">
                    Key Spices in This Kit
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {kitSpices.map((spice) => (
                      <Link
                        key={spice.id}
                        href={`/spice/${spice.slug}`}
                        className="group flex items-center gap-4 p-4 bg-card hover:bg-muted transition-colors"
                      >
                        <div className="h-16 w-16 bg-muted overflow-hidden flex-shrink-0">
                          <Image
                            src={spice.image}
                            alt={spice.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground group-hover:text-muted-foreground transition-colors">
                            {spice.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${spice.price.toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Want to buy spices individually? Click any spice above to view details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recipes You Can Make */}
        {kitRecipes.length > 0 && (
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
                Recipes You Can Make
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {kitRecipes.map((recipe) => (
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
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {recipe.cookTime}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          Serves {recipe.servings}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Cooking Steps (from first linked recipe) */}
              {kitRecipes[0]?.steps?.length > 0 && (
                <div className="mt-14 border-t border-border pt-10">
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                    Cooking Steps
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    A quick guide from the recipe card. For full details, view the recipe above.
                  </p>
                  <ol className="mt-6 space-y-4">
                    {kitRecipes[0].steps.slice(0, 8).map((step, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm text-foreground">
                          {idx + 1}
                        </span>
                        <p className="text-muted-foreground leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Other Kits */}
        {otherKits.length > 0 && (
          <section className="py-16 lg:py-20 bg-secondary">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
                Explore Other Kits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherKits.map((otherKit) => (
                  <Link
                    key={otherKit.id}
                    href={`/cooking-kits/${otherKit.slug}`}
                    className="group bg-card p-6 hover:bg-muted transition-colors"
                  >
                    <div className="aspect-square overflow-hidden bg-muted mb-4">
                      <Image
                        src={otherKit.image}
                        alt={otherKit.name}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-muted-foreground transition-colors">
                      {otherKit.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {otherKit.servings} · {otherKit.estimatedTime}
                    </p>
                    <p className="text-foreground font-medium mt-3">
                      ${otherKit.price.toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 lg:py-20 bg-foreground text-background">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <h2 className="font-serif text-2xl md:text-3xl">
              Ready to Cook?
            </h2>
            <p className="mt-4 text-background/70">
              Get everything you need in one box. Pre-portioned spices, detailed recipe card, and expert tips included.
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="mt-8 h-12 px-10 border-background/30 text-background hover:bg-background/10"
              disabled={!kit.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add {kit.name} to Cart — ${kit.price.toFixed(2)}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
