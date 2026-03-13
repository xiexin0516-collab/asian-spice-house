"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { CART_STORAGE_KEY, type CartLine } from "@/lib/cart-types"

interface CartContextValue {
  items: CartLine[]
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void
  update: (id: string, type: CartLine["type"], quantity: number) => void
  remove: (id: string, type: CartLine["type"]) => void
  clear: () => void
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

function loadFromStorage(): CartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(items: CartLine[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(loadFromStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveToStorage(items)
  }, [items, hydrated])

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const key = `${line.type}:${line.id}`
        const existing = prev.find((i) => `${i.type}:${i.id}` === key)
        const q = (existing?.quantity ?? 0) + quantity
        if (q <= 0) return prev.filter((i) => `${i.type}:${i.id}` !== key)
        const next = prev.filter((i) => `${i.type}:${i.id}` !== key)
        next.push({ ...line, quantity: q })
        return next
      })
    },
    []
  )

  const update = useCallback((id: string, type: CartLine["type"], quantity: number) => {
    setItems((prev) => {
      const key = `${type}:${id}`
      if (quantity <= 0) return prev.filter((i) => `${i.type}:${i.id}` !== key)
      const idx = prev.findIndex((i) => `${i.type}:${i.id}` === key)
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = { ...next[idx], quantity }
      return next
    })
  }, [])

  const remove = useCallback((id: string, type: CartLine["type"]) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items])

  const value = useMemo<CartContextValue>(
    () => ({ items, add, update, remove, clear, count }),
    [items, add, update, remove, clear, count]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
