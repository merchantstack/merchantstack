import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteShell } from "@/components/site/shell";
import { storefrontQuery, DEFAULT_SETTINGS } from "@/lib/storefront";
import type { StoreSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Commerce Nexa — talk to the team" },
      {
        name: "description",
        content:
          "Contact Commerce Nexa about licensing, bulk orders, custom commerce tooling or partner enquiries.",
      },
      { property: "og:title", content: "Contact Commerce Nexa" },
      { property: "og:description", content: "Talk to the Commerce Nexa team over WhatsApp." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useQuery(storefrontQuery);
  const settings = (data?.settings ?? DEFAULT_SETTINGS) as unknown as StoreSettings;
  const [form, setForm] = useState({ name: "", topic: "", message: "" });

  const message = [
    `*Contact enquiry — ${settings.brand_name}*`,
    `Name: ${form.name || "—"}`,
    `Topic: ${form.topic || "General"}`,
    "",
    form.message || "I'd like to know more about your catalogue.",
  ].join("\n");

  return (
    <SiteShell>
      <section className="hero-glow border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-semibold sm:text-4xl">Contact us</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Licensing questions, bulk pricing or a bespoke request — send it straight to our team.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="surface-panel rounded-2xl p-7">
          <h2 className="text-lg font-semibold">Send a message</h2>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="c-name">Your name</Label>
              <Input
                id="c-name"
                className="mt-1.5"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-topic">Topic</Label>
              <Input
                id="c-topic"
                className="mt-1.5"
                placeholder="Licensing, bulk order, support…"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-message">Message</Label>
              <Textarea
                id="c-message"
                rows={5}
                className="mt-1.5"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
          </div>
          <Button size="lg" className="mt-6 w-full" asChild>
            <a
              href={whatsappLink(settings.whatsapp_number, message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" /> Send on WhatsApp
            </a>
          </Button>
        </div>

        <div className="surface-panel h-fit rounded-2xl p-7">
          <h2 className="text-lg font-semibold">Direct channels</h2>
          <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
            {settings.store_email ? (
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-accent" /> {settings.store_email}
              </li>
            ) : null}
            {settings.contact_phone ? (
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-accent" /> {settings.contact_phone}
              </li>
            ) : null}
            {settings.contact_address ? (
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-accent" /> {settings.contact_address}
              </li>
            ) : null}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
