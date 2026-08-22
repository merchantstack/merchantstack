import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Layers, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
  errorComponent: ({ error }) => (
    <p className="p-16 text-center text-sm text-muted-foreground" role="alert">
      {error.message}
    </p>
  ),
  notFoundComponent: () => (
    <p className="p-16 text-center text-sm text-muted-foreground">Section not found.</p>
  ),
});

const TABS = [
  { to: "/admin", label: "Products", exact: true },
  { to: "/admin/categories", label: "Categories", exact: false },
  { to: "/admin/orders", label: "Orders", exact: false },
  { to: "/admin/settings", label: "Settings", exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.user.id)
        .eq("role", "admin")
        .maybeSingle();
      return Boolean(data);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-surface/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Layers className="size-5" />
            </span>
            <span className="font-display font-semibold">Commerce Nexa admin</span>
          </Link>
          <Button
            variant="ghost"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </header>

      <nav className="border-b border-border/70">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.exact }}
              className="border-b-2 border-transparent px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
              activeProps={{ className: "border-primary text-foreground" }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Checking access…</p>
        ) : isAdmin ? (
          <Outlet />
        ) : (
          <div className="surface-panel rounded-2xl p-12 text-center">
            <h1 className="text-xl font-semibold">Admin access required</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account is signed in but has no admin role yet. Ask a store owner to grant it.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
