import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteShell } from "@/components/site/shell";
import { placeOrder } from "@/lib/catalog.functions";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { storefrontQuery, DEFAULT_SETTINGS } from "@/lib/storefront";
import type { StoreSettings } from "@/lib/types";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Commerce Nexa checkout" },
      {
        name: "description",
        content:
          "Review your Commerce Nexa cart and complete checkout over WhatsApp with a structured order summary.",
      },
      { property: "og:title", content: "Your cart — Commerce Nexa" },
      { property: "og:description", content: "Review your cart and check out over WhatsApp." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const { data } = useQuery(storefrontQuery);
  const settings = (data?.settings ?? DEFAULT_SETTINGS) as unknown as StoreSettings;
  const symbol = settings.currency_symbol || "$";
  const submitOrder = useServerFn(placeOrder);

  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [busy, setBusy] = useState(false);

  const checkout = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Add your name and phone number first.");
      return;
    }
    if (cart.items.length === 0) return;

    setBusy(true);
    try {
      const result = await submitOrder({
        data: {
          customer: form,
          items: cart.items.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            unit_price: item.price,
            quantity: item.quantity,
          })),
        },
      });

      const message = buildOrderMessage({
        orderNumber: result.orderNumber,
        brandName: settings.brand_name,
        currencySymbol: symbol,
        customer: form,
        items: cart.items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: cart.subtotal,
      });

      window.open(whatsappLink(settings.whatsapp_number, message), "_blank", "noopener");
      cart.clear();
      toast.success(`Order ${result.orderNumber} created`, {
        description: "We opened WhatsApp with your order summary.",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Your cart</h1>

        {cart.hydrated && cart.items.length === 0 ? (
          <div className="surface-panel mt-10 rounded-2xl p-16 text-center">
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button className="mt-6" asChild>
              <Link to="/shop">Browse the catalogue</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="surface-panel flex flex-wrap items-center gap-4 rounded-2xl p-4"
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      loading="lazy"
                      width={120}
                      height={90}
                      className="size-20 rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="min-w-40 flex-1">
                    <Link
                      to="/products/$slug"
                      params={{ slug: item.slug }}
                      className="font-medium hover:text-primary-glow"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(item.price, symbol)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Decrease quantity"
                      onClick={() => cart.setQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Increase quantity"
                      onClick={() => cart.setQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="w-24 text-right font-medium">
                    {formatPrice(item.price * item.quantity, symbol)}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => cart.remove(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>

            <div className="surface-panel h-fit rounded-2xl p-6">
              <h2 className="text-lg font-semibold">Checkout details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We create your order, then open WhatsApp with a structured summary.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">WhatsApp number</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Order notes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                <span className="text-sm text-muted-foreground">Order total</span>
                <span className="font-display text-2xl font-semibold">
                  {formatPrice(cart.subtotal, symbol)}
                </span>
              </div>

              <Button className="mt-5 w-full" size="lg" disabled={busy} onClick={checkout}>
                <MessageCircle className="size-4" />
                {busy ? "Creating order…" : "Checkout on WhatsApp"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
