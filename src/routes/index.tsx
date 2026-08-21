import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Check, MessageCircle, ShieldCheck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/shell";
import { ProductCard } from "@/components/site/product-card";
import { formatPrice } from "@/lib/format";
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
      <section className="hero-glow border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:py-24">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase text-accent">
              <span className="h-px w-12 bg-accent" />
              <BadgeCheck className="size-4" />
              Verified B2B commerce partner
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl leading-[1.04] font-bold sm:text-6xl lg:text-7xl">
              Commerce systems, <span className="text-accent">selected for growth.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {home["hero_subtitle"] ??
                "Practical SEO, analytics, Klaviyo and product-feed systems—reviewed, clearly priced and supported by real specialists."}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button size="lg" asChild>
                <Link to="/shop">
                  {home["hero_cta"] ?? "Explore marketplace"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 border-b border-accent pb-1 text-sm font-semibold transition-colors hover:text-accent"
              >
                View categories <ArrowRight className="size-4" />
              </Link>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-8">
              {[
                ["Products", `${products.length}`],
                ["Specialist areas", `${categories.length}`],
                ["Order support", "WhatsApp"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dd className="font-display text-xl font-semibold text-accent sm:text-2xl">{value}</dd>
                  <dt className="mt-1 text-[11px] font-semibold uppercase text-muted-foreground">{label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-5">
            {shown[0] ? (
              <Link
                to="/products/$slug"
                params={{ slug: shown[0].slug }}
                className="group relative col-span-2 aspect-[4/3] overflow-hidden bg-surface-2"
              >
                {shown[0].thumbnail ? (
                  <img
                    src={shown[0].thumbnail}
                    alt={`${shown[0].name} preview`}
                    width={1200}
                    height={900}
                    className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-background/95 p-5">
                  <span className="text-[10px] font-bold uppercase text-accent">Editor’s selection</span>
                  <div className="mt-1 flex items-end justify-between gap-4">
                    <h2 className="text-lg font-semibold sm:text-xl">{shown[0].name}</h2>
                    <span className="shrink-0 font-display font-semibold text-accent">
                      {formatPrice(shown[0].price, symbol)}
                    </span>
                  </div>
                </div>
              </Link>
            ) : null}
            {shown.slice(1, 3).map((product) => (
              <Link
                key={product.id}
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="group flex aspect-square flex-col justify-end overflow-hidden bg-surface-2"
              >
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={`${product.name} preview`}
                    width={600}
                    height={600}
                    className="min-h-0 flex-1 object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : null}
                <div className="border-t border-border bg-surface px-4 py-3">
                  <p className="line-clamp-1 text-sm font-semibold">{product.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="border-b border-border py-7 sm:px-6 lg:border-b-0 lg:border-r first:pl-0 last:border-r-0">
              <item.icon className="size-5 text-accent" />
              <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
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
        <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((product) => (
            <ProductCard key={product.id} product={product} symbol={symbol} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase text-accent">Specialist departments</span>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Shop by category</h2>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/categories/$slug"
              params={{ slug: category.slug }}
              className="group relative overflow-hidden bg-background transition-colors hover:bg-surface-2"
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={`${category.name} category`}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="h-40 w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
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
        </div></div>
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
              <li key={step} className="border-t border-border py-6">
                <span className="font-display text-sm font-semibold text-accent">{step}</span>
                <h3 className="mt-3 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <span className="text-xs font-semibold uppercase text-accent">Our standard</span>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">What verified partnership means</h2>
        <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {[
            [
              "Clear scope before payment",
              "Every product states what is included, how it is delivered and where custom implementation begins.",
            ],
            [
              "A real person at checkout",
              "Orders move to WhatsApp so licensing, compatibility and timelines can be confirmed without a ticket queue.",
            ],
            [
              "Delivery with accountability",
              "Digital assets include setup guidance; service engagements include agreed deliverables and a practical handover.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="bg-surface p-7">
              <Check className="size-5 text-accent" />
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
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
            <div key={q} className="border-t border-border py-6">
              <h3 className="text-base font-semibold">{q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
