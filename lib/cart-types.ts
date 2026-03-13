// Cart item stored in context and localStorage (snapshot for display + order)
export type CartProductType = "spice" | "kit"

export interface CartLine {
  id: string
  type: CartProductType
  quantity: number
  name: string
  nameZh: string
  price: number
  image: string
  slug: string
}

export const CART_STORAGE_KEY = "asian-spice-house-cart"
