import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MerchantStack admin" },
      { name: "description", content: "Sign in to the MerchantStack admin console." },
      { property: "og:title", content: "Sign in — MerchantStack admin" },
      { property: "og:description", content: "Access the MerchantStack management console." },
      { property: "og:url", content: "/auth" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin" });
  };

  const signUp = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created", { description: "Ask an owner to grant admin access." });
  };

  return (
    <div className="hero-glow flex min-h-screen items-center justify-center px-4">
      <div className="surface-panel w-full max-w-md rounded-3xl p-8">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Layers className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold">MerchantStack</span>
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Admin console</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage products, categories, orders and store settings.
        </p>

        <Tabs defaultValue="signin" className="mt-7">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="signin">
            <Button className="mt-6 w-full" size="lg" disabled={busy} onClick={signIn}>
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </TabsContent>
          <TabsContent value="signup">
            <Button className="mt-6 w-full" size="lg" disabled={busy} onClick={signUp}>
              {busy ? "Creating…" : "Create account"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
