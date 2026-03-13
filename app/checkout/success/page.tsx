"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-20 w-20 mx-auto text-primary" />
          <h1 className="mt-6 font-serif text-2xl md:text-3xl font-bold text-foreground">
            Thank you for your order
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your order has been placed successfully.
            {orderId && (
              <span className="block mt-1 text-sm">
                Order reference: <span className="font-mono">{orderId.slice(0, 8)}</span>
              </span>
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/shop">Continue shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
