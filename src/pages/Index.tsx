import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { type User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Shirt, Sparkles } from "lucide-react";
import { Wardrobe } from "@/components/Wardrobe";
import { Looks } from "@/components/Looks";
import { Statistics } from "@/components/Statistics";
import { Marketplace } from "@/components/Marketplace";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";

const TABS = [
  { value: "wardrobe", label: "Guarda-roupa" },
  { value: "looks", label: "Looks" },
  { value: "stats", label: "Estatísticas" },
  { value: "marketplace", label: "Marketplace" },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse rounded-2xl bg-surface-muted p-8 shadow-sm">
          <Shirt className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageContainer className="space-y-10">
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm shadow-primary/30">
              <Shirt className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-semibold tracking-tight md:text-4xl">
                Guarda-roupa digital
              </span>
              <Badge
                variant="secondary"
                className="w-fit rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Pro
              </Badge>
            </div>
          </div>
        }
        description={
          <div className="space-y-1 text-sm md:text-base">
            <p>Administre suas peças, looks, estatísticas e vendas em um só lugar.</p>
            <span className="font-medium text-foreground/80">{user.email}</span>
          </div>
        }
        actions={
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        }
      />

      <Tabs defaultValue="wardrobe" className="w-full space-y-8">
        <TabsList className="grid w-full grid-cols-1 gap-2 rounded-2xl bg-surface-muted p-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-xl py-3 text-base font-medium transition data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="wardrobe" className="space-y-8">
          <Wardrobe />
        </TabsContent>
        <TabsContent value="looks" className="space-y-8">
          <Looks />
        </TabsContent>
        <TabsContent value="stats" className="space-y-8">
          <Statistics />
        </TabsContent>
        <TabsContent value="marketplace" className="space-y-8">
          <Marketplace />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Index;
