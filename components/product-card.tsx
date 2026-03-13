import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  description?: string
}

export function ProductCard({ id, name, price, image, category, description }: ProductCardProps) {
  return (
    <div className="group">
      <Link href={`/product/${id}`} className="block">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{category}</p>
          <h3 className="mt-1 font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
        <p className="mt-2 text-lg font-semibold text-foreground">
          ${price.toFixed(2)}
        </p>
        </div>
      </Link>
      <Button className="mt-3 w-full gap-2" variant="outline">
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  )
}
