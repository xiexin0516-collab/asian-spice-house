import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { SubscribeForm } from "@/components/subscribe-form"
import { categories } from "@/lib/data"
import { getFeaturedSpices, getFeaturedKits, getFeaturedRecipes, fetchCuisines } from "@/lib/data-supabase"

const collections = [
  {
    id: "whole-spices",
    name: "Whole Spices",
    description: "Hand-selected, aromatic",
    image: "/images/collection-whole.jpg",
    href: "/shop?category=whole",
  },
  {
    id: "ground-spices",
    name: "Ground Spices",
    description: "Freshly milled, potent",
    image: "/images/collection-ground.jpg",
    href: "/shop?category=ground",
  },
  {
    id: "spice-blends",
    name: "Spice Blends",
    description: "Expertly crafted",
    image: "/images/collection-blends.jpg",
    href: "/shop?category=blends",
  },
]

export default async function HomePage() {
  let featuredProducts = []
  let featuredKits = []
  let featuredRecipes = []
  let cuisines = []
  let loadError = false
  try {
    const [p, k, r, c] = await Promise.all([
      getFeaturedSpices().then((list) => list.slice(0, 4)),
      getFeaturedKits().then((list) => list.slice(0, 2)),
      getFeaturedRecipes().then((list) => list.slice(0, 3)),
      fetchCuisines(),
    ])
    featuredProducts = p
    featuredKits = k
    featuredRecipes = r
    cuisines = c
  } catch {
    loadError = true
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Minimalist Premium */}
        <section className="relative min-h-[90vh] flex items-center justify-center bg-foreground">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-premium.jpg"
              alt="Premium Asian spices"
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
          <div className="relative text-center px-6 max-w-4xl mx-auto">
            <p className="text-background/60 text-sm tracking-[0.3em] uppercase mb-6">
              Established 2009
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-background leading-[1.1] tracking-tight text-balance">
              The Art of
              <br />
              Asian Spices
            </h1>
            <p className="mt-8 text-lg md:text-xl text-background/70 max-w-xl mx-auto leading-relaxed">
              Sourced from the finest producers across Asia. 
              Curated for the discerning home cook.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild 
                className="bg-background text-foreground hover:bg-background/90 px-10 h-12 text-sm tracking-wide uppercase"
              >
                <Link href="/shop">
                  Explore Collection
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="border-background/40 bg-background/10 text-foreground hover:bg-background/20 px-10 h-12 text-sm tracking-wide uppercase"
              >
                <Link href="/about">
                  Our Story
                </Link>
              </Button>
            </div>
          </div>
          {/* Center divider - desktop only */}
          <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="w-px h-16 bg-background/30" />
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
                Collections
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Shop by Category
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={collection.href}
                  className="group relative aspect-[3/4] overflow-hidden bg-muted"
                >
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/30 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="text-background/70 text-xs tracking-[0.2em] uppercase mb-2">
                      {collection.description}
                    </p>
                    <h3 className="font-serif text-2xl text-background">
                      {collection.name}
                    </h3>
                    <div className="mt-4 flex items-center text-background/80 text-sm tracking-wide group-hover:text-background transition-colors">
                      <span>Shop Now</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Cuisine */}
        <section className="py-24 lg:py-32 bg-secondary">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
                Explore
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Shop by Cuisine
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Find the essential spices for your favorite Asian cuisines
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {cuisines.map((cuisine) => (
                <Link
                  key={cuisine.id}
                  href={`/shop?cuisine=${cuisine.id}`}
                  className="group relative aspect-[4/5] overflow-hidden bg-muted"
                >
                  <Image
                    src={cuisine.image}
                    alt={cuisine.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h3 className="font-serif text-xl md:text-2xl text-background">
                      {cuisine.name}
                    </h3>
                    <p className="text-background/70 text-sm mt-1">
                      {cuisine.nameLocal}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
                  Bestsellers
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  Essential Spices
                </h2>
              </div>
              <Link
                href="/shop"
                className="flex items-center text-sm tracking-wide text-foreground hover:text-muted-foreground transition-colors group"
              >
                <span>View All</span>
                <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            
            {loadError ? (
              <p className="text-sm text-destructive">
                Something went wrong loading featured content. Please try again.
              </p>
            ) : featuredProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No featured spices yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {featuredProducts.map((product) => (
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
                      <p className="text-sm text-muted-foreground mt-1">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )
            }
          </div>
        </section>

        {/* Cooking Kits Feature */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
                  Complete Experience
                </p>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                  Cooking Kits
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                  Everything you need to create authentic Asian dishes at home. 
                  Pre-portioned spices, detailed recipes, and expert techniques 
                  in every box.
                </p>
                <div className="mt-10 space-y-6">
                  {featuredKits.map((kit) => (
                    <Link
                      key={kit.id}
                      href={`/cooking-kits/${kit.slug}`}
                      className="group flex items-center justify-between py-5 border-b border-border hover:border-foreground transition-colors"
                    >
                      <div>
                        <h3 className="font-serif text-xl text-foreground group-hover:text-muted-foreground transition-colors">
                          {kit.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {kit.servings} · {kit.estimatedTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-foreground font-medium">
                          ${kit.price.toFixed(2)}
                        </span>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-10">
                  <Button variant="outline" size="lg" asChild className="h-12 px-8 text-sm tracking-wide">
                    <Link href="/cooking-kits">
                      Explore All Kits
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <Image
                    src="/images/kits/hotpot-kit.jpg"
                    alt="Cooking Kit"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story - merged from Journey + Philosophy */}
        <section className="py-24 lg:py-32 bg-foreground text-background">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <p className="text-background/50 text-sm tracking-[0.2em] uppercase mb-6">
              Our Story
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight">
              Why Asian Spice House
            </h2>
            <p className="mt-8 text-background/70 text-lg leading-relaxed">
              Asian cuisine is built on aromatic spices from family farms and traditional producers across Asia. We source the finest quality so you can create authentic flavors at home.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-x-12 gap-y-6">
              <div>
                <p className="font-serif text-3xl text-background">50+</p>
                <p className="text-background/50 text-sm mt-1">Spices</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-background">8</p>
                <p className="text-background/50 text-sm mt-1">Countries</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-background">15</p>
                <p className="text-background/50 text-sm mt-1">Years</p>
              </div>
            </div>
            <div className="mt-10">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-background/30 bg-background/10 text-foreground hover:bg-background/20 h-12 px-10 text-sm tracking-wide"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Cook by Dish Section */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
                Cook by Dish
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                Classic Asian Dishes
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Find the perfect spices and step-by-step recipes to create authentic dishes at home
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Mapo Tofu",
                  nameZh: "麻婆豆腐",
                  description: "Sichuan's iconic dish with silky tofu in spicy, numbing sauce",
                  image: "/images/dishes/mapo-tofu-premium.jpg",
                  spiceLevel: 4,
                  cuisine: "Sichuan",
                  recipeHref: "/recipe/mapo-tofu",
                  kitHref: "/product/mapo-tofu-kit",
                },
                {
                  name: "Hot Pot",
                  nameZh: "火锅",
                  description: "Communal dining experience with aromatic, simmering broth",
                  image: "/images/dishes/hotpot-premium.jpg",
                  spiceLevel: 3,
                  cuisine: "Sichuan",
                  recipeHref: "/recipe/hotpot",
                  kitHref: "/product/hotpot-kit",
                },
                {
                  name: "Kung Pao Chicken",
                  nameZh: "宫保鸡丁",
                  description: "Stir-fried chicken with peanuts and dried chilies",
                  image: "/images/dishes/kung-pao-premium.jpg",
                  spiceLevel: 3,
                  cuisine: "Sichuan",
                  recipeHref: "/recipe/kung-pao-chicken",
                  kitHref: "/product/kungpao-kit",
                },
                {
                  name: "Braised Pork Belly",
                  nameZh: "红烧肉",
                  description: "Melt-in-your-mouth pork in rich, caramelized sauce",
                  image: "/images/dishes/braised-pork-premium.jpg",
                  spiceLevel: 1,
                  cuisine: "Shanghai",
                  recipeHref: "/recipe/braised-pork",
                  kitHref: "/product/braised-pork-kit",
                },
              ].map((dish) => (
                <div
                  key={dish.name}
                  className="group relative overflow-hidden bg-muted"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-card">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                          {dish.cuisine}
                        </span>
                        <span className="text-muted-foreground/40">|</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i < dish.spiceLevel ? 'bg-accent' : 'bg-border'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="font-serif text-2xl text-foreground">
                        {dish.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {dish.nameZh}
                      </p>
                      <p className="text-muted-foreground mt-4 leading-relaxed">
                        {dish.description}
                      </p>
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Link
                          href={dish.recipeHref}
                          className="inline-flex items-center justify-center text-sm tracking-wide text-foreground hover:text-muted-foreground transition-colors"
                        >
                          <span>View Recipe</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Link
                          href={dish.kitHref}
                          className="inline-flex items-center justify-center text-sm tracking-wide text-accent hover:text-accent/80 transition-colors"
                        >
                          <span>Shop Spice Kit</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recipes Section */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
                  From Our Kitchen
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  Recipes
                </h2>
              </div>
              <Link
                href="/recipes"
                className="flex items-center text-sm tracking-wide text-foreground hover:text-muted-foreground transition-colors group"
              >
                <span>View All Recipes</span>
                <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe, index) => (
                <Link
                  key={recipe.id}
                  href={`/recipe/${recipe.id}`}
                  className={`group ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <div className={`relative overflow-hidden bg-muted ${index === 0 ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5">
                    <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">
                      {recipe.cookTime} / {recipe.servings} Servings
                    </p>
                    <h3 className={`font-serif text-foreground group-hover:text-muted-foreground transition-colors ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                      {recipe.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 lg:py-32 bg-secondary">
          <div className="mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-4">
              Stay Connected
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              Join Our Community
            </h2>
            <p className="mt-6 text-muted-foreground">
              Receive exclusive recipes, cooking tips, and early access to new products.
            </p>
            <SubscribeForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
