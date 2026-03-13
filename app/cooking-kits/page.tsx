import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { fetchKits } from "@/lib/data-supabase"

export default async function CookingKitsPage() {
  let kits = []
  let loadError = false
  try {
    kits = await fetchKits()
  } catch {
    loadError = true
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-secondary py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Cooking Kits
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Complete cooking solutions with all the spices and recipes you need to create authentic Asian dishes at home
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 lg:py-16 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-primary">1</span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  Pre-Portioned
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every spice precisely measured for perfect flavor
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-primary">2</span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  Detailed Recipes
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Step-by-step instructions, beginner friendly
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-primary">3</span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  Premium Quality
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Carefully sourced spices, quality guaranteed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Kits Grid */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {loadError ? (
              <p className="text-sm text-destructive">
                Something went wrong loading kits. Please try again.
              </p>
            ) : kits.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No cooking kits available.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {kits.map((kit) => (
                  <div
                    key={kit.id}
                    className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                      <Link href={`/cooking-kits/${kit.slug}`} className="aspect-square sm:aspect-auto overflow-hidden">
                        <Image
                          src={kit.image}
                          alt={kit.name}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                      <div className="p-6 flex flex-col">
                        <Link href={`/cooking-kits/${kit.slug}`}>
                          <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {kit.name}
                          </h2>
                          <p className="text-sm text-muted-foreground">{kit.nameZh}</p>
                        </Link>
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                          {kit.description}
                        </p>
                        <div className="mt-4">
                          <p className="text-xs font-medium text-foreground mb-2">Includes:</p>
                          <div className="flex flex-wrap gap-1">
                            {kit.includes.slice(0, 3).map((item, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground"
                              >
                                {item.split(" ")[0]}
                              </span>
                            ))}
                            {kit.includes.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                                +{kit.includes.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-auto pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xl font-bold text-foreground">
                              ${kit.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {kit.servings}
                            </span>
                          </div>
                          <Button className="w-full gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-16 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold">
              Looking for something specific?
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
              Contact us and we can create a custom spice kit tailored to your needs
            </p>
            <Button variant="secondary" size="lg" className="mt-8" asChild>
              <Link href="/about#contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
