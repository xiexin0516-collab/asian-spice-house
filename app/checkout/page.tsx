"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, CreditCard, Truck, MapPin } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { createClient } from "@/lib/supabase/browser"
import {
  getAddresses,
  saveAddress,
  createOrder,
  type AddressRow,
} from "@/lib/order-actions"

const PAYMENT_OPTIONS = [
  { id: "card", label: "Credit / Debit card", desc: "Pay with card" },
  { id: "paypal", label: "PayPal", desc: "Pay with PayPal account" },
  { id: "bank", label: "Bank transfer", desc: "Pay with bank account" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, clear } = useCart()
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [addresses, setAddresses] = useState<AddressRow[]>([])
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [shipping, setShipping] = useState({
    full_name: "",
    phone: "",
    country: "US",
    state: "",
    city: "",
    street: "",
    postal_code: "",
    save_address: false,
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = subtotal >= 99 ? 0 : 15
  const total = subtotal + shippingCost

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null))
  }, [])

  useEffect(() => {
    if (!user) return
    getAddresses().then(setAddresses)
  }, [user])

  // Redirect if not logged in or cart empty
  useEffect(() => {
    if (user === null) return
    if (!user) {
      router.replace("/login?next=/checkout")
      return
    }
    if (cartItems.length === 0) {
      router.replace("/cart")
    }
  }, [user, cartItems.length, router])

  const fillFromAddress = (a: AddressRow) => {
    setShipping((s) => ({
      ...s,
      full_name: a.full_name,
      phone: a.phone,
      country: a.country,
      state: a.state ?? "",
      city: a.city ?? "",
      street: a.street,
      postal_code: a.postal_code ?? "",
    }))
  }

  const handlePlaceOrder = async () => {
    setSubmitError(null)
    setSaving(true)
    const result = await createOrder(
      {
        shipping_full_name: shipping.full_name,
        shipping_phone: shipping.phone,
        shipping_street: shipping.street,
        shipping_city: shipping.city || undefined,
        shipping_state: shipping.state || undefined,
        shipping_postal_code: shipping.postal_code || undefined,
        shipping_country: shipping.country,
        payment_method: paymentMethod,
        subtotal,
        shipping_cost: shippingCost,
        total,
      },
      cartItems
    )
    setSaving(false)
    if (result.error) {
      setSubmitError(result.error)
      return
    }
    if (shipping.save_address) {
      await saveAddress({
        full_name: shipping.full_name,
        phone: shipping.phone,
        country: shipping.country,
        state: shipping.state || undefined,
        city: shipping.city || undefined,
        street: shipping.street,
        postal_code: shipping.postal_code || undefined,
        is_default: false,
      })
    }
    clear()
    router.push(`/checkout/success?order=${result.orderId}`)
  }

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to cart
          </Link>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Checkout
          </h1>

          <div className="mt-8 flex items-center justify-center gap-4">
            {[
              { num: 1, label: "Shipping" },
              { num: 2, label: "Payment" },
              { num: 3, label: "Confirm" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setStep(s.num)}
                  className={cn(
                    "flex items-center gap-2",
                    step >= s.num ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      step >= s.num
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}
                  >
                    {s.num}
                  </span>
                  <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
                </button>
                {i < 2 && (
                  <div
                    className={cn(
                      "w-8 sm:w-16 h-0.5 mx-2",
                      step > s.num ? "bg-primary" : "bg-muted-foreground/20"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-6 lg:p-8">
                {step === 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="font-serif text-xl font-semibold text-foreground">
                        Shipping address
                      </h2>
                    </div>

                    {addresses.length > 0 && (
                      <div className="mb-6 space-y-2">
                        <p className="text-sm font-medium text-foreground">Saved addresses</p>
                        {addresses.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => fillFromAddress(a)}
                            className="block w-full text-left p-3 rounded-lg border border-border hover:border-primary transition-colors text-sm"
                          >
                            {a.full_name}, {a.phone} — {a.street}, {a.city}
                            {a.state && `, ${a.state}`} {a.postal_code}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Full name</label>
                          <input
                            type="text"
                            value={shipping.full_name}
                            onChange={(e) =>
                              setShipping((s) => ({ ...s, full_name: e.target.value }))
                            }
                            placeholder="Enter your name"
                            className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Phone</label>
                          <input
                            type="tel"
                            value={shipping.phone}
                            onChange={(e) =>
                              setShipping((s) => ({ ...s, phone: e.target.value }))
                            }
                            placeholder="Enter phone number"
                            className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground">Street address</label>
                        <input
                          type="text"
                          value={shipping.street}
                          onChange={(e) =>
                            setShipping((s) => ({ ...s, street: e.target.value }))
                          }
                          placeholder="Street, building, apartment"
                          className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">City</label>
                          <input
                            type="text"
                            value={shipping.city}
                            onChange={(e) =>
                              setShipping((s) => ({ ...s, city: e.target.value }))
                            }
                            placeholder="City"
                            className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">State</label>
                          <input
                            type="text"
                            value={shipping.state}
                            onChange={(e) =>
                              setShipping((s) => ({ ...s, state: e.target.value }))
                            }
                            placeholder="State"
                            className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Postal code</label>
                          <input
                            type="text"
                            value={shipping.postal_code}
                            onChange={(e) =>
                              setShipping((s) => ({ ...s, postal_code: e.target.value }))
                            }
                            placeholder="ZIP"
                            className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground">Country</label>
                        <input
                          type="text"
                          value={shipping.country}
                          onChange={(e) =>
                            setShipping((s) => ({ ...s, country: e.target.value }))
                          }
                          placeholder="Country"
                          className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="save-address"
                          checked={shipping.save_address}
                          onChange={(e) =>
                            setShipping((s) => ({ ...s, save_address: e.target.checked }))
                          }
                          className="rounded border-border"
                        />
                        <label htmlFor="save-address" className="text-sm text-muted-foreground">
                          Save this address for next time
                        </label>
                      </div>
                    </div>

                    <Button
                      className="mt-8 w-full sm:w-auto"
                      onClick={() => setStep(2)}
                      disabled={
                        !shipping.full_name.trim() ||
                        !shipping.phone.trim() ||
                        !shipping.street.trim()
                      }
                    >
                      Next: Payment
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h2 className="font-serif text-xl font-semibold text-foreground">
                        Payment method
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {PAYMENT_OPTIONS.map((opt) => (
                        <label
                          key={opt.id}
                          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === opt.id}
                            onChange={() => setPaymentMethod(opt.id)}
                            className="text-primary"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{opt.label}</p>
                            <p className="text-sm text-muted-foreground">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button onClick={() => setStep(3)}>Next: Confirm order</Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Truck className="h-5 w-5 text-primary" />
                      <h2 className="font-serif text-xl font-semibold text-foreground">
                        Confirm order
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Shipping address
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {shipping.full_name} {shipping.phone}
                              <br />
                              {shipping.street}, {shipping.city}
                              {shipping.state && `, ${shipping.state}`}{" "}
                              {shipping.postal_code} {shipping.country}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-primary hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-muted">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-foreground">Payment</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {PAYMENT_OPTIONS.find((o) => o.id === paymentMethod)?.label ??
                                paymentMethod}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="text-sm text-primary hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-3">Order items</p>
                        <div className="space-y-3">
                          {cartItems.map((item) => (
                            <div key={`${item.type}:${item.id}`} className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {item.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ${item.price.toFixed(2)} x {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-foreground">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {submitError && (
                      <p className="mt-4 text-sm text-destructive">{submitError}</p>
                    )}

                    <div className="mt-8 flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button
                        className="gap-2"
                        onClick={handlePlaceOrder}
                        disabled={saving}
                      >
                        <Lock className="h-4 w-4" />
                        {saving ? "Placing order..." : `Place order — $${total.toFixed(2)}`}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Order summary
                </h2>

                <div className="mt-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={`${item.type}:${item.id}`} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <p className="text-sm text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-xl text-foreground">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Secure checkout</span>
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
