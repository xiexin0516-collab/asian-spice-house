import { categories } from "@/lib/data"
import { fetchSpices } from "@/lib/data-supabase"
import { ShopClient } from "./ShopClient"

export default async function ShopPage() {
  let loadError = false
  let spices = []
  try {
    spices = await fetchSpices()
  } catch {
    loadError = true
  }
  return <ShopClient spices={spices} categories={categories} loadError={loadError} />
}
