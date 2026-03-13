import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Clock, ChevronDown } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const values = [
  {
    title: "Quality First",
    description: "We source only the finest natural spices and ensure every product brings authentic flavor to your cooking.",
  },
  {
    title: "Heritage & Culture",
    description: "We celebrate and share Asian food culture so home cooks everywhere can experience genuine Eastern flavors.",
  },
  {
    title: "Care in Every Order",
    description: "From product selection to delivery, we treat every customer with care for a smooth shopping experience.",
  },
]

const faqs = [
  {
    question: "How long do spices last?",
    answer: "Whole spices keep 2–3 years when sealed; ground spices are best used within 6–12 months. All packaging shows production and best-by dates.",
  },
  {
    question: "How should I store spices?",
    answer: "Store in a cool, dry place away from direct sunlight. Keep opened spices in sealed jars or bags; ground spices can be refrigerated to extend freshness.",
  },
  {
    question: "Do you offer bulk or wholesale orders?",
    answer: "Yes. Restaurants and retailers can contact us for wholesale pricing. Email wholesale@asianspicehouse.com for details.",
  },
  {
    question: "What are shipping times and areas?",
    answer: "We ship across the US. Free shipping on orders over $50. Most orders ship within 1–2 business days; delivery typically 3–5 business days.",
  },
  {
    question: "What is your return policy?",
    answer: "If you receive a product with a quality issue, contact us within 30 days. We offer a satisfaction guarantee. Keep the original packaging and proof of purchase.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/images/about-hero.jpg"
              alt="Asian spices"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-foreground/60" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background text-balance">
              About Asian Spice House
            </h1>
            <p className="mt-6 text-lg md:text-xl text-background/90 max-w-2xl mx-auto text-pretty">
              The art of Asian spices—bringing soul to every dish
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  Our Story
                </h2>
                <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
                  <p>
                    Asian Spice House was born from a love of Asian cooking. Our founders learned how much great spices matter—not just for flavor, but as a bridge to culture and tradition.
                  </p>
                  <p>
                    We source from the best growing regions across Asia: Sichuan peppercorns from Hanyuan, star anise from Guangxi, white pepper from Hainan, and more. Every spice is chosen for quality and authenticity.
                  </p>
                  <p>
                    Today, Asian Spice House is trusted by home cooks everywhere. We offer premium spices, recipes, and cooking kits so you can easily create authentic Asian dishes at home.
                  </p>
                </div>
              </div>
                <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                  <Image
                    src="/images/categories/whole-spices.jpg"
                    alt="Whole spices"
                    width={400}
                    height={533}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted mt-8">
                  <Image
                    src="/images/categories/ground-spices.jpg"
                    alt="Ground spices"
                    width={400}
                    height={533}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Our Values
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Quality, heritage, and service—the values we stand by
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-card rounded-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-serif font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                FAQ
              </h2>
              <p className="mt-4 text-muted-foreground">
                Have more questions? We’re here to help.
              </p>
            </div>
            <div className="mt-12">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Shipping Info */}
        <section id="shipping" className="py-16 lg:py-24 bg-muted">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Shipping
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">Free</span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">Free shipping over $50</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Contiguous US orders over $50 ship free
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">Fast</span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">Quick dispatch</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Orders placed before 3pm ship same business day
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">Safe</span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">Secure packaging</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sealed packaging to keep spices fresh in transit
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  Contact Us
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Questions or feedback? We’ll respond within 24 hours.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-muted-foreground">hello@asianspicehouse.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-muted-foreground">+1 (888) 888-8888</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Hours</p>
                      <p className="text-muted-foreground">Mon–Fri 9:00 AM – 6:00 PM ET</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-muted-foreground">United States</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card rounded-lg p-6 lg:p-8 border border-border">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Send a message
                </h3>
                <form className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <input
                        type="email"
                        placeholder="Your email"
                        className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Subject</label>
                    <select className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Product inquiry</option>
                      <option>Order question</option>
                      <option>Wholesale</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Your message..."
                      className="mt-1 w-full rounded-md px-4 py-3 text-sm bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <Button className="w-full">Send message</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
