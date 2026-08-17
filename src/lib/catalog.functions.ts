import { createServerFn } from "@tanstack/react-start";

const PRODUCT_FIELDS =
  "id,slug,name,category_id,short_description,description,price,compare_at_price,currency,thumbnail,features,whats_included,license_type,license_duration,delivery_method,product_type,tags,status,featured,best_seller,new_product,stock_status,whatsapp_message,seo_title,seo_description,seo_keywords,og_title,og_description,og_image,sort_order,created_at,categories(slug,name)";

export const getStorefront = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicClient } = await import("./supabase-public.server");
  const supabase = createPublicClient();

  const [settings, categories, products] = await Promise.all([
    supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("products")
      .select(PRODUCT_FIELDS)
      .eq("status", "published")
      .order("sort_order")
      .limit(60),
  ]);

  return {
    settings: settings.data ?? null,
    categories: categories.data ?? [],
    products: products.data ?? [],
  };
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./supabase-public.server");
    const supabase = createPublicClient();

    const { data: product } = await supabase
      .from("products")
      .select(PRODUCT_FIELDS)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();

    if (!product) return { product: null, related: [], settings: null };

    const [related, settings] = await Promise.all([
      supabase
        .from("products")
        .select(PRODUCT_FIELDS)
        .eq("status", "published")
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .limit(3),
      supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
    ]);

    return { product, related: related.data ?? [], settings: settings.data ?? null };
  });

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      customer: { name: string; phone: string; email: string; notes: string };
      items: { product_id: string; product_name: string; unit_price: number; quantity: number }[];
    }) => data,
  )
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./supabase-public.server");
    const { orderNumber } = await import("./format");
    const supabase = createPublicClient();

    const items = data.items.slice(0, 50).map((item) => ({
      product_id: item.product_id,
      product_name: String(item.product_name).slice(0, 200),
      unit_price: Number(item.unit_price) || 0,
      quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 99),
    }));
    if (items.length === 0) throw new Error("Your cart is empty.");

    const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const number = orderNumber();

    const { data: customer } = await supabase
      .from("customers")
      .insert({
        name: data.customer.name.slice(0, 120),
        phone: data.customer.phone.slice(0, 40),
        email: data.customer.email.slice(0, 160),
        notes: data.customer.notes.slice(0, 800),
      })
      .select("id")
      .maybeSingle();

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: number,
        customer_id: customer?.id ?? null,
        customer_name: data.customer.name.slice(0, 120),
        customer_phone: data.customer.phone.slice(0, 40),
        customer_email: data.customer.email.slice(0, 160),
        subtotal,
        total: subtotal,
        notes: data.customer.notes.slice(0, 800),
      })
      .select("id,order_number")
      .maybeSingle();

    if (error || !order) throw new Error(error?.message ?? "Could not create the order.");

    await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        unit_price: item.unit_price,
        quantity: item.quantity,
        line_total: item.unit_price * item.quantity,
      })),
    );

    return { orderNumber: order.order_number, total: subtotal };
  });
