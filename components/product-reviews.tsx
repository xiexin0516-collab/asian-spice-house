"use client"

import { useState } from "react"
import { Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Review } from "@/lib/data"
import { createReview } from "@/lib/data-supabase"

function Stars({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const n = 5
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5"
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: n }, (_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  )
}

export function ProductReviews({
  productId,
  productType,
  initialReviews,
  initialStats,
}: {
  productId: string
  productType: "spice" | "kit"
  initialReviews: Review[]
  initialStats: { average: number; count: number }
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [stats, setStats] = useState(initialStats)
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    const res = await createReview(productId, productType, rating, name, comment)
    setSubmitting(false)
    if (res.ok) {
      const trimmedName = name.trim()
      const trimmedComment = comment.trim()
      setMessage({ type: "success", text: "Thank you! Your review has been posted." })
      setName("")
      setComment("")
      setRating(5)
      const newReview: Review = {
        id: "temp-" + Date.now(),
        productId,
        productType,
        rating,
        name: trimmedName,
        comment: trimmedComment,
        createdAt: new Date().toISOString(),
        verified: false,
      }
      setReviews((prev) => [newReview, ...prev])
      setStats((prev) => ({
        count: prev.count + 1,
        average: Math.round(((prev.average * prev.count + rating) / (prev.count + 1)) * 10) / 10,
      }))
    } else {
      setMessage({ type: "error", text: res.error ?? "Something went wrong. Please try again." })
    }
  }

  return (
    <section className="mt-12 border-t border-border pt-10">
      <h2 className="font-serif text-2xl font-bold text-foreground">Reviews</h2>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Stars value={stats.average} size="md" />
          <span className="text-lg font-semibold text-foreground">
            {stats.average > 0 ? stats.average.toFixed(1) : "—"}
          </span>
          <span className="text-muted-foreground">/ 5</span>
        </div>
        <span className="text-muted-foreground">
          {stats.count} {stats.count === 1 ? "review" : "reviews"}
        </span>
      </div>

      <ul className="mt-8 space-y-8">
        {reviews.map((r) => (
          <li key={r.id} className="border-b border-border/60 pb-8 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <Stars value={r.rating} size="sm" />
              {r.verified && (
                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  <Check className="h-3 w-3" />
                  Verified Buyer
                </span>
              )}
            </div>
            <p className="mt-2 text-foreground/90">{r.comment}</p>
            <p className="mt-2 text-sm text-muted-foreground">— {r.name}</p>
          </li>
        ))}
      </ul>

      {reviews.length === 0 && (
        <p className="mt-6 text-muted-foreground">No reviews yet. Be the first to share your experience.</p>
      )}

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <h3 className="font-medium text-foreground">Write a review</h3>
        <div>
          <label className="text-sm text-muted-foreground">Rating</label>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRating(v)}
                className="rounded p-1 transition hover:opacity-80"
                aria-label={`${v} stars`}
              >
                <Star
                  className={`h-8 w-8 ${v <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="review-name" className="text-sm text-muted-foreground">
            Name (e.g. Michael R.)
          </label>
          <input
            id="review-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="review-comment" className="text-sm text-muted-foreground">
            Comment
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Share your experience with this product..."
          />
        </div>
        {message && (
          <p className={message.type === "success" ? "text-green-600" : "text-destructive"}>{message.text}</p>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit review"}
        </Button>
      </form>
    </section>
  )
}

export { Stars }
