import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

type Form = {
  brand_name: string;
  tagline: string;
  whatsapp_number: string;
  currency_symbol: string;
  store_email: string;
  contact_phone: string;
  contact_address: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta: string;
  footer_about: string;
};

const EMPTY: Form = {
  brand_name: "",
  tagline: "",
  whatsapp_number: "",
  currency_symbol: "$",
  store_email: "",
  contact_phone: "",
  contact_address: "",
  hero_title: "",
  hero_subtitle: "",
  hero_cta: "",
  footer_about: "",
};

function AdminSettings() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Form>(EMPTY);

  const settings = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const value = settings.data;
    if (!value) return;
    const home = (value.homepage_content ?? {}) as Record<string, string>;
    const footer = (value.footer_content ?? {}) as Record<string, string>;
    setForm({
      brand_name: value.brand_name ?? "",
      tagline: value.tagline ?? "",
      whatsapp_number: value.whatsapp_number ?? "",
      currency_symbol: value.currency_symbol ?? "$",
      store_email: value.store_email ?? "",
      contact_phone: value.contact_phone ?? "",
      contact_address: value.contact_address ?? "",
      hero_title: home["hero_title"] ?? "",
      hero_subtitle: home["hero_subtitle"] ?? "",
      hero_cta: home["hero_cta"] ?? "",
      footer_about: footer["about"] ?? "",
    });
  }, [settings.data]);

  const save = useMutation({
    mutationFn: async (value: Form) => {
      const home = (settings.data?.homepage_content ?? {}) as Record<string, string>;
      const { error } = await supabase
        .from("store_settings")
        .update({
          brand_name: value.brand_name,
          tagline: value.tagline,
          whatsapp_number: value.whatsapp_number,
          currency_symbol: value.currency_symbol,
          store_email: value.store_email,
          contact_phone: value.contact_phone,
          contact_address: value.contact_address,
          homepage_content: {
            ...home,
            hero_title: value.hero_title,
            hero_subtitle: value.hero_subtitle,
            hero_cta: value.hero_cta,
          },
          footer_content: { about: value.footer_about },
        })
        .eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["storefront"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const field = (key: keyof Form, label: string, textarea = false) => (
    <div className={textarea ? "sm:col-span-2" : ""}>
      <Label htmlFor={`s-${key}`}>{label}</Label>
      {textarea ? (
        <Textarea
          id={`s-${key}`}
          rows={3}
          className="mt-1.5"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <Input
          id={`s-${key}`}
          className="mt-1.5"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold">Store settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Brand, contact details, WhatsApp routing and homepage copy.
      </p>

      <div className="surface-panel mt-8 grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        {field("brand_name", "Brand name")}
        {field("whatsapp_number", "WhatsApp number (digits, with country code)")}
        {field("currency_symbol", "Currency symbol")}
        {field("store_email", "Store email")}
        {field("contact_phone", "Contact phone")}
        {field("contact_address", "Contact address")}
        {field("tagline", "Tagline", true)}
        {field("hero_title", "Homepage hero title", true)}
        {field("hero_subtitle", "Homepage hero subtitle", true)}
        {field("hero_cta", "Homepage CTA label")}
        {field("footer_about", "Footer about text", true)}
      </div>

      <Button className="mt-6" disabled={save.isPending} onClick={() => save.mutate(form)}>
        {save.isPending ? "Saving…" : "Save settings"}
      </Button>
    </div>
  );
}
