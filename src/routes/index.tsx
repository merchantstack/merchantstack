import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, MessageCircle, ShieldCheck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/shell";
import { ProductCard } from "@/components/site/product-card";
import { storefrontQuery, DEFAULT_SETTINGS } from "@/lib/storefront";
import type { Category, Product, StoreSettings } from "@/lib/types";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontQuery),
  head: () => ({
    meta: [
      { title: "MerchantStack — Premium commerce tooling marketplace" },
      {
        name: "description",
        content:
          "Buy licensed product feed managers, SEO systems, Google Merchant tools and growth assets. Instant delivery, WhatsApp checkout.",
      },
      { property: "og:title", content: "MerchantStack — Premium commerce tooling marketplace" },
      {
        property: "og:description",
        content:
          "Licensed commerce tooling and growth assets for modern merchants, with instant WhatsApp checkout.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
  errorComponent: ({ error }) => (
    <SiteShell>
      <p className="p-16 text-center text-sm text-muted-foreground" role="alert">
        {error.message}
      </p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="p-16 text-center text-sm text-muted-foreground">Nothing here yet.</p>
    </SiteShell>
  ),
});

const VALUE_PROPS = [
  {
    icon: Zap,
    title: "Instant delivery",
    body: "Licenses, files and access details are dispatched the moment your order is confirmed.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted supply",
    body: "Every listing is reviewed for licensing clarity, support terms and production readiness.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp checkout",
    body: "No clunky forms. Your cart becomes a structured order message with one tap.",
  },
  {
    icon: BadgeCheck,
    title: "Merchant-grade",
    body: "Tooling built for feed operators, agencies and ecommerce teams running real volume.",
  },
];

function HomePage() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const settings = (data.settings ?? DEFAULT_SETTINGS) as unknown as StoreSettings;
  const symbol = settings.currency_symbol || "$";
  const categories = (data.categories ?? []) as unknown as Category[];
  const products = (data.products ?? []) as unknown as Product[];
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const shown = featured.length ? featured : products.slice(0, 6);
  const home = settings.homepage_content ?? {};

  return (
    <SiteShell>
      <section className="hero-glow relative overflow-hidden border-b border-border/60">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium tracking-wide text-accent">
              <span className="size-1.5 rounded-full bg-accent" />
              {products.length} licensed products in stock
            </span>
            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              {home["hero_title"] ?? "Commerce infrastructure for merchants who move fast"}
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {home["hero_subtitle"] ?? settings.tagline}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/shop">
                  {home["hero_cta"] ?? "Browse the catalogue"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/categories">Explore categories</Link>
              </Button>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-8">
              {[
                ["Products", home["stat_products"] ?? `${products.length}+`],
                ["Categories", home["stat_categories"] ?? `${categories.length}`],
                ["Delivery", home["stat_delivery"] ?? "Instant"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="surface-panel overflow-hidden rounded-3xl">
              <img
                src="/images/hero.jpg"
                alt="Abstract visualisation of commerce dashboards and data panels"
                width={1920}
                height={1080}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="surface-panel rounded-2xl p-6">
              <item.icon className="size-5 text-accent" />
              <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Featured this month</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Hand-picked tooling our merchants deploy first.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/shop">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((product) => (
            <ProductCard key={product.id} product={product} symbol={symbol} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Shop by category</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/categories/$slug"
              params={{ slug: category.slug }}
              className="group surface-panel relative overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={`${category.name} category`}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="h-40 w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                />
              ) : null}
              <div className="p-5">
                <h3 className="text-base font-semibold">{category.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {category.description || `Explore ${category.name.toLowerCase()} products.`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">How buying works here</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            No accounts, no card forms, no waiting on a support queue. Three steps, one
            conversation.
          </p>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Pick what you need",
                "Add flows, tools or a service package to your cart. Mix templates and done-for-you work freely.",
              ],
              [
                "02",
                "Send the order on WhatsApp",
                "Checkout turns your cart into a clean, itemised message. You confirm details in chat with a real person.",
              ],
              [
                "03",
                "Get it delivered",
                "Templates arrive instantly. Services start with a short scoping call and an agreed timeline.",
              ],
            ].map(([step, title, body]) => (
              <li key={step} className="surface-panel rounded-2xl p-6">
                <span className="font-display text-sm font-semibold text-accent">{step}</span>
                <h3 className="mt-3 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">What merchants say</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            [
              "We swapped three half-finished Klaviyo flows for the abandoned cart and win-back templates. Recovered revenue was up inside the first fortnight.",
              "Tolu A.",
              "Head of Growth, apparel DTC",
            ],
            [
              "The Merchant Center feed cleanup paid for itself. Disapprovals went from 400-odd items to single digits.",
              "Daniel R.",
              "Ecommerce Manager, home goods",
            ],
            [
              "Ordering over WhatsApp felt odd at first, then genuinely faster. Questions answered, files sent, done in an afternoon.",
              "Priya S.",
              "Founder, skincare brand",
            ],
          ].map(([quote, name, role]) => (
            <figure key={name} className="surface-panel flex h-full flex-col rounded-2xl p-6">
              <blockquote className="text-sm leading-relaxed text-foreground/90">
                “{quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border/60 pt-4 text-sm">
                <span className="font-medium">{name}</span>
                <span className="block text-xs text-muted-foreground">{role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Common questions</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            [
              "How are templates delivered?",
              "Flow templates and snippet packs are sent as importable files with setup notes, straight after your order is confirmed on WhatsApp.",
            ],
            [
              "Do services include implementation?",
              "Yes. SEO, GA4 and Merchant Center packages are done-for-you engagements with a scoping call, agreed deliverables and a handover doc.",
            ],
            [
              "Can I pay in another currency?",
              "Prices are listed in USD, but we invoice in GBP, EUR or NGN on request. Just say so in the chat.",
            ],
            [
              "What if a template does not fit my store?",
              "Tell us your setup before ordering. If it is not a fit we will say so, and we can quote a customised version instead.",
            ],
          ].map(([q, a]) => (
            <div key={q} className="surface-panel rounded-2xl p-6">
              <h3 className="text-base font-semibold">{q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
