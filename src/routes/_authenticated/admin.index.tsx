import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminProducts,
});

type Draft = {
  id?: string;
  slug: string;
  name: string;
  category_id: string;
  short_description: string;
  description: string;
  price: string;
  compare_at_price: string;
  thumbnail: string;
  features: string;
  whats_included: string;
  license_type: string;
  license_duration: string;
  delivery_method: string;
  status: string;
  featured: boolean;
  best_seller: boolean;
  new_product: boolean;
  seo_title: string;
  seo_description: string;
};

const EMPTY: Draft = {
  slug: "",
  name: "",
  category_id: "",
  short_description: "",
  description: "",
  price: "0",
  compare_at_price: "",
  thumbnail: "",
  features: "",
  whats_included: "",
  license_type: "Single-store commercial license",
  license_duration: "Lifetime",
  delivery_method: "Instant digital delivery",
  status: "published",
  featured: false,
  best_seller: false,
  new_product: false,
  seo_title: "",
  seo_description: "",
};

function AdminProducts() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);

  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name,slug)")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const categories = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (value: Draft) => {
      const payload = {
        slug: value.slug.trim(),
        name: value.name.trim(),
        category_id: value.category_id || null,
        short_description: value.short_description,
        description: value.description,
        price: Number(value.price) || 0,
        compare_at_price: value.compare_at_price ? Number(value.compare_at_price) : null,
        thumbnail: value.thumbnail || null,
        features: value.features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        whats_included: value.whats_included
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        license_type: value.license_type,
        license_duration: value.license_duration,
        delivery_method: value.delivery_method,
        status: value.status,
        featured: value.featured,
        best_seller: value.best_seller,
        new_product: value.new_product,
        seo_title: value.seo_title,
        seo_description: value.seo_description,
      };
      const query = value.id
        ? supabase.from("products").update(payload).eq("id", value.id)
        : supabase.from("products").insert(payload);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product saved");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["storefront"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["storefront"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const edit = (product: Record<string, unknown>) => {
    setDraft({
      id: product["id"] as string,
      slug: (product["slug"] as string) ?? "",
      name: (product["name"] as string) ?? "",
      category_id: (product["category_id"] as string) ?? "",
      short_description: (product["short_description"] as string) ?? "",
      description: (product["description"] as string) ?? "",
      price: String(product["price"] ?? 0),
      compare_at_price: product["compare_at_price"] ? String(product["compare_at_price"]) : "",
      thumbnail: (product["thumbnail"] as string) ?? "",
      features: ((product["features"] as string[]) ?? []).join("\n"),
      whats_included: ((product["whats_included"] as string[]) ?? []).join("\n"),
      license_type: (product["license_type"] as string) ?? "",
      license_duration: (product["license_duration"] as string) ?? "",
      delivery_method: (product["delivery_method"] as string) ?? "",
      status: (product["status"] as string) ?? "published",
      featured: Boolean(product["featured"]),
      best_seller: Boolean(product["best_seller"]),
      new_product: Boolean(product["new_product"]),
      seo_title: (product["seo_title"] as string) ?? "",
      seo_description: (product["seo_description"] as string) ?? "",
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.data?.length ?? 0} products in the catalogue.
          </p>
        </div>
        <Button
          onClick={() => {
            setDraft(EMPTY);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> New product
        </Button>
      </div>

      <div className="surface-panel mt-8 overflow-x-auto rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(products.data ?? []).map((product) => (
              <TableRow key={product.id as string}>
                <TableCell className="font-medium">{product.name as string}</TableCell>
                <TableCell className="text-muted-foreground">
                  {(product.categories as { name?: string } | null)?.name ?? "—"}
                </TableCell>
                <TableCell>{formatPrice(Number(product.price))}</TableCell>
                <TableCell className="capitalize text-muted-foreground">
                  {product.status as string}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => edit(product)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove.mutate(product.id as string)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit product" : "New product"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                className="mt-1.5"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="p-slug">Slug</Label>
              <Input
                id="p-slug"
                className="mt-1.5"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={draft.category_id}
                onValueChange={(value) => setDraft({ ...draft, category_id: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(categories.data ?? []).map((category) => (
                    <SelectItem key={category.id as string} value={category.id as string}>
                      {category.name as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={draft.status}
                onValueChange={(value) => setDraft({ ...draft, status: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="p-price">Price</Label>
              <Input
                id="p-price"
                className="mt-1.5"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="p-compare">Compare-at price</Label>
              <Input
                id="p-compare"
                className="mt-1.5"
                value={draft.compare_at_price}
                onChange={(e) => setDraft({ ...draft, compare_at_price: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-thumb">Thumbnail URL</Label>
              <Input
                id="p-thumb"
                className="mt-1.5"
                value={draft.thumbnail}
                onChange={(e) => setDraft({ ...draft, thumbnail: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-short">Short description</Label>
              <Textarea
                id="p-short"
                rows={2}
                className="mt-1.5"
                value={draft.short_description}
                onChange={(e) => setDraft({ ...draft, short_description: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-desc">Full description</Label>
              <Textarea
                id="p-desc"
                rows={6}
                className="mt-1.5"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="p-features">Features (one per line)</Label>
              <Textarea
                id="p-features"
                rows={5}
                className="mt-1.5"
                value={draft.features}
                onChange={(e) => setDraft({ ...draft, features: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="p-included">What's included (one per line)</Label>
              <Textarea
                id="p-included"
                rows={5}
                className="mt-1.5"
                value={draft.whats_included}
                onChange={(e) => setDraft({ ...draft, whats_included: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="p-license">License type</Label>
              <Input
                id="p-license"
                className="mt-1.5"
                value={draft.license_type}
                onChange={(e) => setDraft({ ...draft, license_type: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="p-duration">License duration</Label>
              <Input
                id="p-duration"
                className="mt-1.5"
                value={draft.license_duration}
                onChange={(e) => setDraft({ ...draft, license_duration: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-seo-title">SEO title</Label>
              <Input
                id="p-seo-title"
                className="mt-1.5"
                value={draft.seo_title}
                onChange={(e) => setDraft({ ...draft, seo_title: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="p-seo-desc">SEO description</Label>
              <Textarea
                id="p-seo-desc"
                rows={2}
                className="mt-1.5"
                value={draft.seo_description}
                onChange={(e) => setDraft({ ...draft, seo_description: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-6 sm:col-span-2">
              {(
                [
                  ["featured", "Featured"],
                  ["best_seller", "Best seller"],
                  ["new_product", "New"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={draft[key]}
                    onCheckedChange={(checked) => setDraft({ ...draft, [key]: checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={save.isPending} onClick={() => save.mutate(draft)}>
              {save.isPending ? "Saving…" : "Save product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
