import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/site/shell";
import { storefrontQuery } from "@/lib/storefront";
import type { Category, Product } from "@/lib/types";

export const Route = createFileRoute("/categories/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontQuery),
  head: () => ({
    meta: [
      { title: "Categories — Commerce Nexa commerce catalogue" },
      {
        name: "description",
        content:
          "Explore Commerce Nexa categories: Google Merchant, SEO, product feeds, Shopify, marketing, analytics, security and more.",
      },
      { property: "og:title", content: "Categories — Commerce Nexa" },
      {
        property: "og:description",
        content: "Every product category in the Commerce Nexa marketplace.",
      },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
  errorComponent: ({ error }) => (
    <SiteShell>
      <p className="p-16 text-center text-sm text-muted-foreground" role="alert">
        {error.message}
      </p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="p-16 text-center text-sm text-muted-foreground">No categories yet.</p>
    </SiteShell>
  ),
});

function CategoriesPage() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const categories = (data.categories ?? []) as unknown as Category[];
  const products = (data.products ?? []) as unknown as Product[];

  return (
    <SiteShell>
      <section className="hero-glow border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-semibold sm:text-4xl">Browse by category</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Ten focused segments covering feeds, search, storefronts and growth.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = products.filter((p) => p.categories?.slug === category.slug).length;
          return (
            <Link
              key={category.id}
              to="/categories/$slug"
              params={{ slug: category.slug }}
              className="group surface-panel overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={`${category.name} category`}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="h-44 w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                />
              ) : null}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <span className="text-xs text-muted-foreground">{count} products</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {category.description || `Tooling and assets for ${category.name.toLowerCase()}.`}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </SiteShell>
  );
}
