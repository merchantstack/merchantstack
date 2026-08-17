export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image_url: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  short_description: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  currency: string;
  thumbnail: string | null;
  features: string[];
  whats_included: string[];
  license_type: string;
  license_duration: string;
  delivery_method: string;
  product_type: string;
  tags: string[];
  status: string;
  featured: boolean;
  best_seller: boolean;
  new_product: boolean;
  stock_status: string;
  whatsapp_message: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string | null;
  sort_order: number;
  created_at?: string;
  categories?: { slug: string; name: string } | null;
};

export type StoreSettings = {
  brand_name: string;
  tagline: string;
  logo_url: string | null;
  whatsapp_number: string;
  currency: string;
  currency_symbol: string;
  store_email: string;
  contact_phone: string;
  contact_address: string;
  social_links: Record<string, string>;
  homepage_content: Record<string, string>;
  footer_content: Record<string, string>;
};

export type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  subtotal: number;
  total: number;
  currency: string;
  status: string;
  payment_status: string;
  delivery_status: string;
  whatsapp_status: string;
  notes: string;
  created_at: string;
  order_items?: {
    id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[];
};
