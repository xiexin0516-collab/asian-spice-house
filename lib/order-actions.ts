"use server"

import { createClient } from "@/lib/supabase/server"
import type { CartLine } from "@/lib/cart-types"

export interface AddressRow {
  id: string
  full_name: string
  phone: string
  country: string
  state: string | null
  city: string | null
  street: string
  postal_code: string | null
  is_default: boolean
}

export async function getAddresses(): Promise<AddressRow[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("addresses")
    .select("id, full_name, phone, country, state, city, street, postal_code, is_default")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })

  if (error) return []
  return (data ?? []) as AddressRow[]
}

export async function saveAddress(form: {
  full_name: string
  phone: string
  country: string
  state?: string
  city?: string
  street: string
  postal_code?: string
  is_default?: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not logged in" }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    full_name: form.full_name,
    phone: form.phone,
    country: form.country || "US",
    state: form.state ?? null,
    city: form.city ?? null,
    street: form.street,
    postal_code: form.postal_code ?? null,
    is_default: form.is_default ?? false,
  })

  if (error) return { error: error.message }
  return { ok: true }
}

export interface CreateOrderInput {
  shipping_full_name: string
  shipping_phone: string
  shipping_street: string
  shipping_city?: string
  shipping_state?: string
  shipping_postal_code?: string
  shipping_country: string
  payment_method: string
  subtotal: number
  shipping_cost: number
  total: number
}

export async function createOrder(input: CreateOrderInput, items: CartLine[]): Promise<{ error?: string; orderId?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not logged in" }
  if (items.length === 0) return { error: "Cart is empty" }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      subtotal: input.subtotal,
      shipping_cost: input.shipping_cost,
      total: input.total,
      shipping_full_name: input.shipping_full_name,
      shipping_phone: input.shipping_phone,
      shipping_street: input.shipping_street,
      shipping_city: input.shipping_city ?? null,
      shipping_state: input.shipping_state ?? null,
      shipping_postal_code: input.shipping_postal_code ?? null,
      shipping_country: input.shipping_country || "US",
      payment_method: input.payment_method || "card",
    })
    .select("id")
    .single()

  if (orderError || !order) return { error: orderError?.message ?? "Failed to create order" }

  const rows = items.map((line) => ({
    order_id: order.id,
    product_type: line.type,
    product_id: line.id,
    product_name: line.name,
    product_name_zh: line.nameZh,
    product_slug: line.slug,
    unit_price: line.price,
    quantity: line.quantity,
    line_total: Math.round(line.price * line.quantity * 100) / 100,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(rows)
  if (itemsError) return { error: itemsError.message }

  return { orderId: order.id }
}
