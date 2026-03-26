"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Menu, X, ChevronDown, LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/browser"
import { useCart } from "@/contexts/cart-context"
import type { User as AuthUser } from "@supabase/supabase-js"

const navigation = [
  { name: "Shop", href: "/shop" },
  { name: "Cooking Kits", href: "/cooking-kits" },
  { name: "Recipes", href: "/recipes" },
  { name: "Our Story", href: "/about" },
]

export function Header() {
  const router = useRouter()
  const { count: cartCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [mounted])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        {/* Left Navigation */}
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.slice(0, 2).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[13px] font-medium tracking-wide uppercase text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Center Logo */}
        <div className="flex-1 flex justify-center lg:flex-none">
          <Link href="/" className="text-center">
            <span className="font-serif text-xl md:text-2xl tracking-tight text-foreground">
              ASIAN SPICE HOUSE
            </span>
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-10">
          {navigation.slice(2).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[13px] font-medium tracking-wide uppercase text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Actions - Dropdowns render only after mount to avoid Radix id hydration mismatch */}
        <div className="flex items-center gap-4">
          {!mounted ? (
            <>
              <span className="hidden sm:flex gap-1.5 h-9 px-2 items-center text-xs text-muted-foreground">
                <LogIn className="h-4 w-4" />
                Sign in
              </span>
            </>
          ) : (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 h-9 px-2">
                      <User className="h-4 w-4" />
                      <span className="text-xs truncate max-w-[120px]">{user.email}</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 h-9">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Button>
                </Link>
              )}
            </>
          )}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-10 w-10">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 border-t border-border",
          mobileMenuOpen ? "max-h-[400px]" : "max-h-0 border-transparent"
        )}
      >
        <div className="px-6 py-6 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-3 text-sm font-medium tracking-wide uppercase text-foreground/70 hover:text-foreground transition-colors border-b border-border last:border-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="py-3 border-b border-border sm:hidden">
            {user ? (
              <button
                type="button"
                onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-foreground/70 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out ({user.email})
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-foreground/70 hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
