import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { discountPercent, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, symbol = "$" }: { product: Product; symbol?: string }) {
  const cart = useCart();
  const off = discountPercent(product.price, product.compare_at_price);

  return (
    <article className="group surface-panel relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-surface-2"
      >
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={`${product.name} preview`}
            loading="lazy"
            width={1200}
            height={900}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.best_seller ? <Badge variant="secondary">Best seller</Badge> : null}
          {product.new_product ? <Badge>New</Badge> : null}
          {off > 0 ? <Badge variant="outline">-{off}%</Badge> : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {product.categories?.name ? (
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            {product.categories.name}
          </span>
        ) : null}
        <h3 className="text-base leading-snug font-semibold">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-primary-glow"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short_description}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <div className="text-lg font-semibold">{formatPrice(product.price, symbol)}</div>
            {product.compare_at_price ? (
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_at_price, symbol)}
              </div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              aria-label={`Add ${product.name} to cart`}
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
              <ShoppingBag className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" asChild aria-label={`View ${product.name}`}>
              <Link to="/products/$slug" params={{ slug: product.slug }}>
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
