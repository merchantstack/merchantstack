import { queryOptions } from "@tanstack/react-query";
import { getStorefront, getProductBySlug } from "./catalog.functions";
import type { StoreSettings } from "./types";

export const storefrontQuery = queryOptions({
  queryKey: ["storefront"],
  queryFn: () => getStorefront(),
  staleTime: 60_000,
});

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
    staleTime: 60_000,
  });

export const DEFAULT_SETTINGS: StoreSettings = {
  brand_name: "MerchantStack",
  tagline: "Commerce infrastructure for modern businesses.",
  logo_url: null,
  whatsapp_number: "",
  currency: "USD",
  currency_symbol: "$",
  store_email: "",
  contact_phone: "",
  contact_address: "",
  social_links: {},
  homepage_content: {},
  footer_content: {},
};
