import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/shell";
import { ProductCard } from "@/components/site/product-card";
import { storefrontQuery, DEFAULT_SETTINGS } from "@/lib/storefront";
import type { Category, Product, StoreSettings } from "@/lib/types";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontQuery),
  head: ({ params }) => {
    const label = params.slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${label} products — MerchantStack` },
        {
          name: "description",
          content: `Licensed ${label.toLowerCase()} tools and assets available on MerchantStack with instant delivery and WhatsApp checkout.`,
        },
        { property: "og:title", content: `${label} products — MerchantStack` },
        {
          property: "og:description",
          content: `Browse ${label.toLowerCase()} products on MerchantStack.`,
        },
        { property: "og:url", content: `/categories/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/categories/${params.slug}` }],
    };
  },
  component: CategoryPage,
  errorComponent: ({ error }) => (
    <SiteShell>
      <p className="p-16 text-center text-sm text-muted-foreground" role="alert">
        {error.message}
      </p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="p-16 text-center text-sm text-muted-foreground">Category not found.</p>
    </SiteShell>
  ),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(storefrontQuery);
  const settings = (data.settings ?? DEFAULT_SETTINGS) as unknown as StoreSettings;
  const categories = (data.categories ?? []) as unknown as Category[];
  const category = categories.find((item) => item.slug === slug);
  const products = ((data.products ?? []) as unknown as Product[]).filter(
    (product) => product.categories?.slug === slug,
  );

  return (
    <SiteShell>
      <section className="hero-glow border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Link to="/categories" className="text-xs uppercase tracking-[0.18em] text-accent">
            Categories
          </Link>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {category?.name ?? "Category"}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {category?.description || `Products in the ${category?.name ?? slug} segment.`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing listed in this category right now.
            </p>
            <Button className="mt-5" asChild>
              <Link to="/shop">Browse full catalogue</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                symbol={settings.currency_symbol || "$"}
              />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
