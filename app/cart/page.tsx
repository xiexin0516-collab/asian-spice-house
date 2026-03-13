"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { items: cartItems, update, remove, clear } = useCart()
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 99 ? 0 : 15
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">
              Your cart is empty
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explore our premium spices
            </p>
            <Button className="mt-6" asChild>
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 lg:py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Cart
          </h1>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-border text-sm font-medium text-muted-foreground">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <div key={`${item.type}:${item.id}`} className="p-4 md:p-6 relative">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                          <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/product/${item.id}`}
                              className="font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.type === "kit" ? "Cooking Kit" : "Spice"}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-4 md:col-span-2 text-center">
                          <span className="md:hidden text-sm text-muted-foreground">Price: </span>
                          <span className="text-foreground">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>

                        <div className="col-span-4 md:col-span-2 flex items-center justify-center">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => update(item.id, item.type, item.quantity - 1)}
                              className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => update(item.id, item.type, item.quantity + 1)}
                              className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-3 md:col-span-2 text-right">
                          <span className="font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="col-span-1 text-right md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2">
                          <button
                            type="button"
                            onClick={() => remove(item.id, item.type)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Link
                  href="/shop"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={() => clear()}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear cart
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  Order summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 99 && (
                    <p className="text-xs text-muted-foreground">
                      Add ${(99 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-xl text-foreground">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-medium text-foreground">Promo code</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 rounded-md px-3 py-2 text-sm bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>

                <Button className="w-full mt-6 gap-2" size="lg" asChild>
                  <Link href="/checkout">
                    Proceed to checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span>Secure payment</span>
                    <span>•</span>
                    <span>Quality guarantee</span>
                    <span>•</span>
                    <span>7-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
