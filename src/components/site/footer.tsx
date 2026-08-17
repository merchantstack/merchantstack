import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Layers, Mail, MapPin, Phone } from "lucide-react";

import { storefrontQuery, DEFAULT_SETTINGS } from "@/lib/storefront";

export function SiteFooter() {
  const { data } = useQuery(storefrontQuery);
  const settings = data?.settings ?? DEFAULT_SETTINGS;
  const categories = (data?.categories ?? []).slice(0, 6);

  return (
    <footer className="mt-24 border-t border-border/70 bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Layers className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold">{settings.brand_name}</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            {settings.footer_content?.["about"] ?? settings.tagline}
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {settings.store_email ? (
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-accent" /> {settings.store_email}
              </li>
            ) : null}
            {settings.contact_phone ? (
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-accent" /> {settings.contact_phone}
              </li>
            ) : null}
            {settings.contact_address ? (
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" /> {settings.contact_address}
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Catalogue</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to="/categories/$slug"
                  params={{ slug: category.slug }}
                  className="transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Company</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/shop" className="transition-colors hover:text-foreground">
                All products
              </Link>
            </li>
            <li>
              <Link to="/admin" className="transition-colors hover:text-foreground">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {settings.brand_name}. All rights reserved.
      </div>
    </footer>
  );
}
