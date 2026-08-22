import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, Menu, ShoppingBag } from "lucide-react";

import brandLogo from "@/assets/commerce-nexa-logo.png.asset.json";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { storefrontQuery, DEFAULT_SETTINGS } from "@/lib/storefront";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Catalogue" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { data } = useQuery(storefrontQuery);
  const settings = data?.settings ?? DEFAULT_SETTINGS;
  const cart = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={brandLogo.url}
            alt={`${settings.brand_name} logo`}
            className="size-9 rounded-sm object-contain"
            width={36}
            height={36}
          />
          <span className="font-display text-lg font-semibold">
            {settings.brand_name}
          </span>
          <BadgeCheck className="size-4 text-accent" aria-label="Verified partner" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="border-b border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
              activeProps={{ className: "text-foreground border-accent" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild aria-label="Open cart" className="relative">
            <Link to="/cart">
              <ShoppingBag className="size-5" />
              {cart.count > 0 ? (
                <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]">
                  {cart.count}
                </Badge>
              ) : null}
            </Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/shop">Browse catalogue</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-10 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                    activeProps={{ className: "text-foreground bg-secondary" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
