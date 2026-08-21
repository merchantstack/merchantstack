import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Globe2, HandshakeIcon, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site/shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Commerce Nexa — commerce tooling supplier" },
      {
        name: "description",
        content:
          "Commerce Nexa curates and licenses production-ready commerce tooling for merchants, agencies and ecommerce operators worldwide.",
      },
      { property: "og:title", content: "About Commerce Nexa" },
      {
        property: "og:description",
        content: "Who we are and how we source licensed commerce tooling.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    icon: Building2,
    title: "Built for operators",
    body: "Every listing solves a concrete merchandising, feed or visibility problem — no filler bundles.",
  },
  {
    icon: HandshakeIcon,
    title: "Clear licensing",
    body: "Licence type, duration and delivery method are published on every product page before you buy.",
  },
  {
    icon: Rocket,
    title: "Fast fulfilment",
    body: "Orders are confirmed over WhatsApp and delivered digitally, usually within minutes.",
  },
  {
    icon: Globe2,
    title: "Global merchants",
    body: "We supply teams across ecommerce, agency and SaaS operations in more than a dozen markets.",
  },
];

function AboutPage() {
  return (
    <SiteShell>
      <section className="hero-glow border-b border-border/60">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-semibold sm:text-5xl">
            We supply the tooling behind modern merchants
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            Commerce Nexa is a curated marketplace for licensed digital commerce products: feed
            managers, SEO systems, Google Merchant utilities, storefront themes and growth assets.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 md:grid-cols-2">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="surface-panel rounded-2xl p-7">
            <pillar.icon className="size-5 text-accent" />
            <h2 className="mt-4 text-lg font-semibold">{pillar.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{pillar.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 text-center sm:px-6">
        <div className="surface-panel rounded-3xl p-12">
          <h2 className="text-2xl font-semibold">Ready to see the catalogue?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Nineteen licensed products across ten commerce categories.
          </p>
          <Button size="lg" className="mt-7" asChild>
            <Link to="/shop">Browse products</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
