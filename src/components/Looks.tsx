import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { SectionHeader } from "./layout/SectionHeader";
import { EmptyState } from "./ui/empty-state";
import { CreateLookModal } from "./modals/CreateLookModal";
import { Plus, Sparkles } from "lucide-react";

interface Look {
  id: string;
  name: string;
  occasion: string | null;
  item_ids: string[];
  created_at: string;
}

interface Item {
  id: string;
  name: string;
  image_url: string | null;
}

export const Looks = () => {
  const [looks, setLooks] = useState<Look[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [looksResult, itemsResult] = await Promise.all([
        supabase
          .from("looks")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("wardrobe_items").select("id, name, image_url"),
      ]);

      if (looksResult.error) throw looksResult.error;
      if (itemsResult.error) throw itemsResult.error;

      setLooks(looksResult.data ?? []);
      setItems(itemsResult.data ?? []);
    } catch (error) {
      toast({
        title: "Erro ao carregar looks",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const deleteLook = async (id: string) => {
    if (!confirm("Deseja realmente remover este look?")) {
      return;
    }

    try {
      const { error } = await supabase.from("looks").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Look removido",
        description: "O look foi excluído com sucesso.",
      });

      await loadData();
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const itemsById = useMemo(() => {
    return items.reduce<Record<string, Item>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [items]);

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Meus looks"
        description="Combine peças do seu guarda-roupa e planeje visuais para qualquer ocasião."
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar look
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`look-skeleton-${index}`}
              className="h-72 rounded-3xl bg-surface-muted animate-pulse"
            />
          ))}
        </div>
      ) : looks.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {looks.map((look) => {
            const lookItems = (look.item_ids ?? [])
              .map((itemId) => itemsById[itemId])
              .filter(Boolean) as Item[];
            const visibleItems = lookItems.slice(0, 4);
            const remaining = Math.max(
              0,
              lookItems.length - visibleItems.length
            );

            return (
              <Card
                key={look.id}
                className="overflow-hidden rounded-3xl border-transparent bg-white/90 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-hover)]"
              >
                <div className="relative grid aspect-square grid-cols-2 gap-1 bg-surface-muted/60 p-1">
                  {visibleItems.length ? (
                    visibleItems.map((item, index) => (
                      <div
                        key={`${look.id}-${item?.id ?? index}`}
                        className="relative overflow-hidden rounded-2xl bg-background"
                      >
                        {item?.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
                            <Sparkles className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/70 p-8 text-center text-muted-foreground">
                      <Sparkles className="h-6 w-6" />
                      <p className="text-sm">Adicione peças para visualizar este look.</p>
                    </div>
                  )}

                  {remaining > 0 && (
                    <div className="absolute bottom-3 right-3 rounded-full bg-foreground/90 px-3 py-1 text-xs font-medium text-white shadow">
                      +{remaining}
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {look.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(look.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => deleteLook(look.id)}
                    >
                      Remover
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {lookItems.length} {lookItems.length === 1 ? "peça" : "peças"}
                    </span>
                    {look.occasion && (
                      <Badge variant="secondary" className="rounded-full">
                        {look.occasion}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Sparkles className="h-6 w-6 text-primary" />}
          title="Crie seu primeiro look"
          description="Selecione suas peças favoritas e monte combinações para diferentes ocasiões."
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar look
            </Button>
          }
        />
      )}

      <CreateLookModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={loadData}
        items={items}
      />
    </section>
  );
};
