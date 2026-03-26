import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { AddToCart } from "@/components/add-to-cart"
import { ProductReviews, Stars } from "@/components/product-reviews"
import { getSpiceById, getKitById, getReviewsByProduct, getReviewStats } from "@/lib/data-supabase"

type Params = Promise<{ id: string }>

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params
  const [product, kit] = await Promise.all([getSpiceById(id), getKitById(id)])
  const item = product || kit
  if (!item) notFound()

  const displayWeight =
    "weight" in item && item.weight
      ? /^\d+$/.test(item.weight)
        ? `${item.weight}g`
        : item.weight
      : ""

  const isKit = !!kit
  const productType = isKit ? "kit" as const : "spice" as const
  const [reviews, reviewStats, allSpices] = await Promise.all([
    getReviewsByProduct(id, productType),
    getReviewStats(id, productType),
    (await import("@/lib/data-supabase")).fetchSpices(),
  ])
  const relatedProducts = allSpices.filter((p) => p.id !== id).slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href={isKit ? "/cooking-kits" : "/shop"}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {isKit ? "Cooking Kits" : "Shop"}
            </Link>
          </nav>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={item.image}
                alt={item.name}
                width={800}
                height={800}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  {isKit ? "Cooking Kit" : (product?.category || "")}
                </p>
                <h1 className="mt-2 font-serif text-3xl md:text-4xl font-bold text-foreground">
                  {item.name}
                </h1>
                {"nameEn" in item && (
                  <p className="mt-1 text-lg text-muted-foreground">{item.nameEn}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <p className="text-3xl font-bold text-foreground">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Stars value={reviewStats.average} size="sm" />
                    <span className="text-sm font-medium text-foreground">
                      {reviewStats.average > 0 ? reviewStats.average.toFixed(1) : "—"}
                    </span>
                    <span className="text-sm">
                      ({reviewStats.count} {reviewStats.count === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Description</h3>
                <p className="mt-2 text-foreground/80 leading-relaxed">
                  {item.details || item.description}
                </p>
              </div>

              {/* Ingredients (spice only) */}
              {"ingredients" in item && item.ingredients && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Ingredients</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.ingredients}</p>
                </div>
              )}

              {/* How to use (spice only) */}
              {"howToUse" in item && item.howToUse && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">How to use</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.howToUse}</p>
                </div>
              )}

              {/* Product Meta: Origin, Spec, Servings */}
              <div className="mt-6 space-y-2 text-sm">
                {"origin" in item && item.origin && (
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Origin: </span> {item.origin}
                  </p>
                )}
                {"weight" in item && item.weight && (
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Spec: </span> {displayWeight}
                  </p>
                )}
                {"servings" in item && item.servings && (
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Servings: </span> {item.servings}
                  </p>
                )}
              </div>

              {/* Kit Includes */}
              {isKit && kit.includes && (
                <div className="mt-6">
                  <h3 className="font-medium text-foreground">Kit includes:</h3>
                  <ul className="mt-2 space-y-1">
                    {kit.includes.map((include, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {include}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <AddToCart
                id={item.id}
                type={isKit ? "kit" : "spice"}
                name={item.name}
                nameZh={item.nameZh}
                price={item.price}
                image={item.image}
                slug={item.slug}
                inStock={item.inStock}
              />

              {/* Trust elements (Add to Cart 下方) */}
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-foreground/70" />
                  Secure checkout
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-foreground/70" />
                  Free shipping over $50
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-foreground/70" />
                  Premium sourced spices
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-foreground/70" />
                  30-day satisfaction guarantee
                </li>
              </ul>
            </div>
          </div>

          {/* Reviews */}
          <ProductReviews
            productId={id}
            productType={productType}
            initialReviews={reviews}
            initialStats={reviewStats}
          />

          {/* Related Products */}
          <section className="mt-16 lg:mt-24 border-t border-border pt-16">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              You may also like
            </h2>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
