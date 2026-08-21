import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, MessageCircle, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SiteShell } from "@/components/site/shell";
import { ProductCard } from "@/components/site/product-card";
import { useCart } from "@/lib/cart";
import { discountPercent, formatPrice } from "@/lib/format";
import { productQuery, DEFAULT_SETTINGS } from "@/lib/storefront";
import type { Product, StoreSettings } from "@/lib/types";
import { buildProductEnquiry, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data.product) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const product = loaderData?.product as Product | undefined | null;
    if (!product) {
      return {
        meta: [{ title: "Product unavailable — Commerce Nexa" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = product.seo_title || `${product.name} — Commerce Nexa`;
    const description = product.seo_description || product.short_description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: product.seo_keywords },
        { property: "og:title", content: product.og_title || title },
        { property: "og:description", content: product.og_description || description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${params.slug}` },
        ...(product.og_image?.startsWith("https://")
          ? [
              { property: "og:image", content: product.og_image },
              { name: "twitter:image", content: product.og_image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: `/products/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description,
            image: product.thumbnail ?? undefined,
            brand: { "@type": "Brand", name: "Commerce Nexa" },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: product.currency || "USD",
              availability: "https://schema.org/InStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
  errorComponent: ({ error }) => (
    <SiteShell>
      <p className="p-16 text-center text-sm text-muted-foreground" role="alert">
        {error.message}
      </p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="p-20 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Button className="mt-6" asChild>
          <Link to="/shop">Back to catalogue</Link>
        </Button>
      </div>
    </SiteShell>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const cart = useCart();

  const product = data.product as unknown as Product;
  const related = (data.related ?? []) as unknown as Product[];
  const settings = (data.settings ?? DEFAULT_SETTINGS) as unknown as StoreSettings;
  const symbol = settings.currency_symbol || "$";
  const off = discountPercent(product.price, product.compare_at_price);

  const enquiry = buildProductEnquiry({
    brandName: settings.brand_name,
    productName: product.name,
    price: product.price,
    currencySymbol: symbol,
    url: typeof window === "undefined" ? `/products/${slug}` : window.location.href,
  });

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/shop" className="hover:text-foreground">
            Catalogue
          </Link>
          {product.categories?.slug ? (
            <>
              <span className="mx-2">/</span>
              <Link
                to="/categories/$slug"
                params={{ slug: product.categories.slug }}
                className="hover:text-foreground"
              >
                {product.categories.name}
              </Link>
            </>
          ) : null}
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel flex items-center justify-center overflow-hidden rounded-3xl bg-surface-2 p-4">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={`${product.name} product image`}
                width={1200}
                height={900}
                className="max-h-[460px] w-full rounded-2xl object-contain"
              />
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              {product.categories?.name ? (
                <Badge variant="secondary">{product.categories.name}</Badge>
              ) : null}
              {product.best_seller ? <Badge>Best seller</Badge> : null}
              {off > 0 ? <Badge variant="outline">-{off}% today</Badge> : null}
            </div>

            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-muted-foreground">{product.short_description}</p>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl font-semibold">
                {formatPrice(product.price, symbol)}
              </span>
              {product.compare_at_price ? (
                <span className="pb-1 text-sm text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price, symbol)}
                </span>
              ) : null}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => {
                  cart.add({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    thumbnail: product.thumbnail,
                  });
                  toast.success("Added to cart", { description: product.name });
                }}
              >
                <ShoppingBag className="size-4" /> Add to cart
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href={whatsappLink(settings.whatsapp_number, enquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" /> Enquire on WhatsApp
                </a>
              </Button>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, label: "License", value: product.license_type },
                { icon: Check, label: "Duration", value: product.license_duration },
                { icon: Truck, label: "Delivery", value: product.delivery_method },
                { icon: ShoppingBag, label: "Type", value: product.product_type },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} className="surface-panel rounded-xl p-4">
                    <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      <row.icon className="size-3.5 text-accent" /> {row.label}
                    </dt>
                    <dd className="mt-1.5 text-sm">{row.value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>

        <Separator className="my-14" />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-xl font-semibold">About this product</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {product.description.split("\n").map((paragraph, index) =>
                paragraph.trim() ? <p key={index}>{paragraph}</p> : null,
              )}
            </div>
          </div>

          <div className="space-y-8">
            {product.features?.length ? (
              <div className="surface-panel rounded-2xl p-6">
                <h2 className="text-base font-semibold">Key features</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.whats_included?.length ? (
              <div className="surface-panel rounded-2xl p-6">
                <h2 className="text-base font-semibold">What's included</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {product.whats_included.map((item, index) => (
                    <li key={index} className="flex gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {related.length ? (
          <section className="mt-20">
            <h2 className="text-xl font-semibold">Related products</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} symbol={symbol} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SiteShell>
  );
}
