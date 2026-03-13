"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import type { CartProductType } from "@/lib/cart-types"

interface AddToCartProps {
  id: string
  type: CartProductType
  name: string
  nameZh: string
  price: number
  image: string
  slug: string
  inStock?: boolean
}

export function AddToCart({
  id,
  type,
  name,
  nameZh,
  price,
  image,
  slug,
  inStock = true,
}: AddToCartProps) {
  const router = useRouter()
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    add({ id, type, name, nameZh, price, image, slug }, quantity)
    setQuantity(1)
    router.refresh()
  }

  const handleBuyNow = () => {
    add({ id, type, name, nameZh, price, image, slug }, quantity)
    setQuantity(1)
    router.push("/checkout")
  }

  return (
    <>
      <div className="mt-8">
        <label className="text-sm font-medium text-foreground">Quantity</label>
        <div className="mt-2 flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            disabled={!inStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            disabled={!inStock}
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          onClick={handleBuyNow}
          disabled={!inStock}
        >
          Buy Now
        </Button>
      </div>
    </>
  )
}
