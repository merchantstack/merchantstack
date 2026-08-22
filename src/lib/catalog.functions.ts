import { createServerFn } from "@tanstack/react-start";

export const getStorefront = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicClient } = await import("./supabase-public.server");
  const supabase = createPublicClient();
  const productFields =
    "id,slug,name,category_id,short_description,description,price,compare_at_price,currency,thumbnail,features,whats_included,license_type,license_duration,delivery_method,product_type,tags,status,featured,best_seller,new_product,stock_status,whatsapp_message,seo_title,seo_description,seo_keywords,og_title,og_description,og_image,sort_order,created_at,categories(slug,name)";

  const [settings, categories, products] = await Promise.all([
    supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase
      .from("products")
      .select(productFields)
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
    const productFields =
      "id,slug,name,category_id,short_description,description,price,compare_at_price,currency,thumbnail,features,whats_included,license_type,license_duration,delivery_method,product_type,tags,status,featured,best_seller,new_product,stock_status,whatsapp_message,seo_title,seo_description,seo_keywords,og_title,og_description,og_image,sort_order,created_at,categories(slug,name)";

    const { data: product } = await supabase
      .from("products")
      .select(productFields)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();

    if (!product) return { product: null, related: [], settings: null };

    const [related, settings] = await Promise.all([
      supabase
        .from("products")
        .select(productFields)
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { orderNumber } = await import("./format");

    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const name = String(data.customer?.name ?? "").trim().slice(0, 120);
    const phone = String(data.customer?.phone ?? "").trim().slice(0, 40);
    const email = String(data.customer?.email ?? "").trim().slice(0, 160);
    const notes = String(data.customer?.notes ?? "").trim().slice(0, 800);

    if (name.length < 2) throw new Error("Please enter your full name.");
    if (phone.length < 6) throw new Error("Please enter a valid WhatsApp number.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    const requested = (Array.isArray(data.items) ? data.items : [])
      .slice(0, 50)
      .filter((item) => uuid.test(String(item?.product_id ?? "")))
      .map((item) => ({
        product_id: String(item.product_id),
        quantity: Math.min(Math.max(Math.floor(Number(item.quantity) || 1), 1), 99),
      }));

    if (requested.length === 0) throw new Error("Your cart is empty.");

    // Prices and names always come from the database, never from the client.
    const { data: catalogRows, error: catalogError } = await supabaseAdmin
      .from("products")
      .select("id,name,price")
      .eq("status", "published")
      .in(
        "id",
        requested.map((item) => item.product_id),
      );

    if (catalogError) throw new Error("Could not verify your cart items.");

    const catalog = new Map((catalogRows ?? []).map((row) => [row.id, row]));
    const items = requested
      .filter((item) => catalog.has(item.product_id))
      .map((item) => {
        const product = catalog.get(item.product_id)!;
        const unitPrice = Number(product.price) || 0;
        return {
          product_id: product.id,
          product_name: product.name,
          unit_price: unitPrice,
          quantity: item.quantity,
          line_total: unitPrice * item.quantity,
        };
      });

    if (items.length === 0) throw new Error("Your cart items are no longer available.");

    const subtotal = items.reduce((sum, i) => sum + i.line_total, 0);
    const number = orderNumber();
    const customerId = crypto.randomUUID();
    const orderId = crypto.randomUUID();

    const { error: customerError } = await supabaseAdmin.from("customers").insert({
      id: customerId,
      name,
      phone,
      email,
      notes,
    });

    if (customerError) throw new Error("Could not save your checkout details.");

    // Status fields are fixed server-side so they can never be spoofed by a caller.
    const { error: orderError } = await supabaseAdmin.from("orders").insert({
      id: orderId,
      order_number: number,
      customer_id: customerId,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      subtotal,
      total: subtotal,
      discount_total: 0,
      status: "pending",
      payment_status: "unpaid",
      delivery_status: "not_delivered",
      whatsapp_status: "initiated",
      notes,
    });

    if (orderError) throw new Error("Could not create the order.");

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      items.map((item) => ({ order_id: orderId, ...item })),
    );

    if (itemsError) throw new Error("Could not save the order items.");

    return { orderNumber: number, total: subtotal };
  });
