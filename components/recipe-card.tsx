import Image from "next/image"
import Link from "next/link"
import { Clock, Users } from "lucide-react"

interface RecipeCardProps {
  id: string
  title: string
  image: string
  cookTime: string
  servings: number
  category: string
  description?: string
}

export function RecipeCard({ id, title, image, cookTime, servings, category, description }: RecipeCardProps) {
  return (
    <Link href={`/recipe/${id}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <Image
          src={image}
          alt={title}
          width={600}
          height={450}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{category}</p>
        <h3 className="mt-1 font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {cookTime}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Serves {servings}
          </span>
        </div>
      </div>
    </Link>
  )
}
