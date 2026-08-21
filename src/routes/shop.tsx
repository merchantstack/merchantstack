import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteShell } from "@/components/site/shell";
import { ProductCard } from "@/components/site/product-card";
import { storefrontQuery, DEFAULT_SETTINGS } from "@/lib/storefront";
import type { Category, Product, StoreSettings } from "@/lib/types";

type ShopSearch = {
  q?: string | undefined;
  category?: string | undefined;
  sort?: string | undefined;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    sort: typeof search["sort"] === "string" ? search["sort"] : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontQuery),
  head: () => ({
    meta: [
      { title: "Catalogue — Commerce Nexa commerce tooling" },
      {
        name: "description",
        content:
          "Browse every Commerce Nexa product: feed managers, SEO tools, Google Merchant solutions, themes and growth assets.",
      },
      { property: "og:title", content: "Catalogue — Commerce Nexa" },
      {
        property: "og:description",
        content: "Every licensed commerce product available on Commerce Nexa.",
      },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
  errorComponent: ({ error }) => (
    <SiteShell>
      <p className="p-16 text-center text-sm text-muted-foreground" role="alert">
        {error.message}
      </p>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <p className="p-16 text-center text-sm text-muted-foreground">No products found.</p>
    </SiteShell>
  ),
});

function ShopPage() {
  const { data } = useSuspenseQuery(storefrontQuery);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

  const settings = (data.settings ?? DEFAULT_SETTINGS) as unknown as StoreSettings;
  const symbol = settings.currency_symbol || "$";
  const categories = (data.categories ?? []) as unknown as Category[];
  const all = (data.products ?? []) as unknown as Product[];

  const term = (search.q ?? "").toLowerCase().trim();
  let products = all.filter((product) => {
    const matchesCategory = !search.category || product.categories?.slug === search.category;
    const matchesTerm =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.short_description.toLowerCase().includes(term);
    return matchesCategory && matchesTerm;
  });

  if (search.sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (search.sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  if (search.sort === "name") products = [...products].sort((a, b) => a.name.localeCompare(b.name));

  const update = (patch: ShopSearch) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  return (
    <SiteShell>
      <section className="hero-glow border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-semibold sm:text-4xl">Product catalogue</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {all.length} licensed commerce products across {categories.length} categories. Filter,
            compare, then check out over WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="surface-panel flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search.q ?? ""}
              onChange={(event) => update({ q: event.target.value || undefined })}
              placeholder="Search products…"
              className="pl-9"
              aria-label="Search products"
            />
          </div>
          <Select
            value={search.category ?? "all"}
            onValueChange={(value) => update({ category: value === "all" ? undefined : value })}
          >
            <SelectTrigger className="md:w-56" aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={search.sort ?? "featured"}
            onValueChange={(value) => update({ sort: value === "featured" ? undefined : value })}
          >
            <SelectTrigger className="md:w-48" aria-label="Sort products">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
          {search.q || search.category || search.sort ? (
            <Button
              variant="ghost"
              onClick={() => navigate({ search: {}, replace: true })}
              className="md:w-auto"
            >
              Reset
            </Button>
          ) : null}
        </div>

        {products.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted-foreground">
            No products match those filters.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} symbol={symbol} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
