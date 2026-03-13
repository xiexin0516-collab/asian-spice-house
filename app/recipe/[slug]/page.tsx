import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Users, ChefHat, Printer, Share2, ShoppingBag, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  getRecipeBySlug,
  getSpicesForRecipe,
  getKitById,
  getRecipesByCuisine,
  fetchCuisines,
} from "@/lib/data-supabase"

type Params = Promise<{ slug: string }>

export default async function RecipePage({ params }: { params: Params }) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)
  if (!recipe) notFound()

  const [linkedSpices, linkedKit, relatedRecipesList, cuisines] = await Promise.all([
    getSpicesForRecipe(recipe.id),
    recipe.kitId ? getKitById(recipe.kitId) : Promise.resolve(null),
    getRecipesByCuisine(recipe.cuisine).then((r) => r.filter((x) => x.id !== recipe.id).slice(0, 3)),
    fetchCuisines(),
  ])
  const relatedRecipes = relatedRecipesList
  const cuisineInfo = cuisines.find((c) => c.id === recipe.cuisine)

  const difficultyLabel = {
    easy: "Easy",
    medium: "Medium", 
    hard: "Advanced"
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[50vh] min-h-[400px] lg:h-[60vh]">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-5xl w-full px-6 lg:px-8 pb-12">
              {/* Breadcrumb */}
              <Link
                href="/recipes"
                className="inline-flex items-center text-sm text-background/70 hover:text-background transition-colors mb-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Recipes
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-[0.15em] uppercase text-background/70">
                  {cuisineInfo?.name || recipe.cuisine}
                </span>
                <span className="text-background/40">|</span>
                <span className="text-xs tracking-[0.15em] uppercase text-background/70">
                  {difficultyLabel[recipe.difficulty]}
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-background">
                {recipe.title}
              </h1>
              <p className="mt-2 text-lg text-background/70">
                {recipe.titleZh}
              </p>
              
              <p className="mt-4 text-background/80 leading-relaxed max-w-2xl">
                {recipe.description}
              </p>

              {/* Recipe Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-background/70">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {recipe.cookTime}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Serves {recipe.servings}
                </span>
                <span className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  {difficultyLabel[recipe.difficulty]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Sidebar - Ingredients & Shop */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 space-y-8">
                
                {/* Ingredients */}
                <div>
                  <h2 className="font-serif text-xl text-foreground border-b border-border pb-3">
                    Ingredients
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="text-foreground/80">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Linked Cooking Kit */}
                {linkedKit && (
                  <div className="bg-secondary p-6">
                    <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3">
                      Complete Kit Available
                    </p>
                    <h3 className="font-serif text-lg text-foreground">
                      {linkedKit.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {linkedKit.servings} · {linkedKit.estimatedTime}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Everything you need in one box
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        ${linkedKit.price.toFixed(2)}
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/cooking-kits/${linkedKit.slug}`}>
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          View Kit
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Linked Spices */}
                {linkedSpices.length > 0 && (
                  <div>
                    <h3 className="font-serif text-lg text-foreground border-b border-border pb-3">
                      Key Spices
                    </h3>
                    <div className="mt-4 space-y-4">
                      {linkedSpices.map((spice) => (
                        <Link
                          key={spice.id}
                          href={`/spice/${spice.slug}`}
                          className="flex items-center gap-4 group"
                        >
                          <div className="h-16 w-16 overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={spice.image}
                              alt={spice.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                              {spice.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {spice.nameZh}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              ${spice.price.toFixed(2)}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                    
                    {/* Add All to Cart Button */}
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      Add All Spices to Cart
                    </Button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content - Steps */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <h2 className="font-serif text-2xl text-foreground mb-8">
                Instructions
              </h2>
              <ol className="space-y-8">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-foreground/80 leading-relaxed">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Tips Section */}
              <div className="mt-12 p-8 bg-secondary">
                <h3 className="font-serif text-xl text-foreground">
                  Chef's Tips
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    Prepare all ingredients before you start cooking. Asian stir-fry moves fast!
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    Adjust spice levels to your preference. Start mild, add more as needed.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    Fresh spices make a noticeable difference. Our whole spices are sourced at peak freshness.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-2">
                    More from {cuisineInfo?.name} Cuisine
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                    Related Recipes
                  </h2>
                </div>
                <Button variant="outline" asChild className="hidden sm:flex">
                  <Link href={`/recipes?cuisine=${recipe.cuisine}`}>
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedRecipes.map((relatedRecipe) => (
                  <Link
                    key={relatedRecipe.id}
                    href={`/recipe/${relatedRecipe.slug}`}
                    className="group"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                      <Image
                        src={relatedRecipe.image}
                        alt={relatedRecipe.title}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>{relatedRecipe.cookTime}</span>
                      <span>·</span>
                      <span>Serves {relatedRecipe.servings}</span>
                    </div>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                      {relatedRecipe.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {relatedRecipe.titleZh}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
