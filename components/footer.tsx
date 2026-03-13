import Link from "next/link"

const footerLinks = {
  shop: [
    { name: "Whole Spices", href: "/shop?category=whole" },
    { name: "Ground Spices", href: "/shop?category=ground" },
    { name: "Spice Blends", href: "/shop?category=blends" },
    { name: "Cooking Kits", href: "/cooking-kits" },
  ],
  learn: [
    { name: "Recipes", href: "/recipes" },
    { name: "Our Story", href: "/about" },
    { name: "Spice Guide", href: "/about#guide" },
  ],
  support: [
    { name: "Contact", href: "/about#contact" },
    { name: "Shipping", href: "/about#shipping" },
    { name: "FAQ", href: "/about#faq" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl tracking-tight">
                ASIAN SPICE HOUSE
              </span>
            </Link>
            <p className="mt-6 text-sm text-background/60 leading-relaxed max-w-xs">
              Premium Asian spices sourced directly from family farms across Asia.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-background/50 mb-6">
              Shop
            </h3>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-background/50 mb-6">
              Learn
            </h3>
            <ul className="space-y-4">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-background/50 mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-background/40">
            &copy; {new Date().getFullYear()} Asian Spice House. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-xs text-background/40 hover:text-background/70 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-background/40 hover:text-background/70 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
