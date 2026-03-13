"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface SubscribeFormProps {
  variant?: "primary" | "outline"
}

export function SubscribeForm({ variant = "primary" }: SubscribeFormProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (variant === "outline") {
    return (
      <form className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-5 py-3 text-sm bg-background border border-border focus:outline-none focus:border-foreground transition-colors"
        />
        <button
          type="submit"
          className="px-8 py-3 text-sm tracking-wide uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors"
        >
          Subscribe
        </button>
      </form>
    )
  }

  return (
    <form className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-5 py-3 text-sm bg-background border border-border focus:outline-none focus:border-foreground transition-colors"
      />
      <Button size="lg" className="h-12 px-8 text-sm tracking-wide uppercase">
        Subscribe
      </Button>
    </form>
  )
}

