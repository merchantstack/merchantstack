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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategories,
});

type Draft = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  sort_order: string;
};

const EMPTY: Draft = { slug: "", name: "", description: "", image_url: "", sort_order: "0" };

function AdminCategories() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);

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
        description: value.description,
        image_url: value.image_url || null,
        sort_order: Number(value.sort_order) || 0,
      };
      const query = value.id
        ? supabase.from("categories").update(payload).eq("id", value.id)
        : supabase.from("categories").insert(payload);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category saved");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["storefront"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["storefront"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.data?.length ?? 0} store sections.
          </p>
        </div>
        <Button
          onClick={() => {
            setDraft(EMPTY);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> New category
        </Button>
      </div>

      <div className="surface-panel mt-8 overflow-x-auto rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(categories.data ?? []).map((category) => (
              <TableRow key={category.id as string}>
                <TableCell className="font-medium">{category.name as string}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug as string}</TableCell>
                <TableCell>{category.sort_order as number}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setDraft({
                        id: category.id as string,
                        slug: category.slug as string,
                        name: category.name as string,
                        description: (category.description as string) ?? "",
                        image_url: (category.image_url as string) ?? "",
                        sort_order: String(category.sort_order ?? 0),
                      });
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove.mutate(category.id as string)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draft.id ? "Edit category" : "New category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="c-name">Name</Label>
              <Input
                id="c-name"
                className="mt-1.5"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-slug">Slug</Label>
              <Input
                id="c-slug"
                className="mt-1.5"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-desc">Description</Label>
              <Textarea
                id="c-desc"
                rows={3}
                className="mt-1.5"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-image">Image URL</Label>
              <Input
                id="c-image"
                className="mt-1.5"
                value={draft.image_url}
                onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="c-order">Sort order</Label>
              <Input
                id="c-order"
                className="mt-1.5"
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={save.isPending} onClick={() => save.mutate(draft)}>
              Save category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
