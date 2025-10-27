import { useState, type KeyboardEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Check, Heart, Sparkles, Trash2 } from "lucide-react";
import { ItemDetailsModal } from "./modals/ItemDetailsModal";
import { EditItemModal } from "./modals/EditItemModal";

interface WardrobeItemProps {
  item: {
    id: string;
    name: string;
    category: string;
    color: string;
    season: string;
    image_url: string | null;
    tags: string[];
    usage_count: number;
    favorite: boolean;
    created_at: string;
  };
  onUpdate: () => void;
}

type WardrobeItemRow = WardrobeItemProps["item"];

export const WardrobeItem = ({ item, onUpdate }: WardrobeItemProps) => {
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  const toggleFavorite = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("wardrobe_items")
        .update({ favorite: !item.favorite } as Partial<WardrobeItemRow>)
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: item.favorite ? "Favorito removido" : "Favorito adicionado",
        description: item.favorite
          ? `${item.name} foi removido dos favoritos.`
          : `${item.name} agora aparece entre seus favoritos.`,
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "Erro ao atualizar favorito",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("wardrobe_items")
        .update(
          { usage_count: item.usage_count + 1 } as Partial<WardrobeItemRow>
        )
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: "Uso registrado",
        description: `${item.name} marcado como usado hoje.`,
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "Erro ao registrar uso",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async () => {
    if (!confirm("Deseja realmente remover esta peça?")) return;

    try {
      setLoading(true);

      if (item.image_url) {
        const path = item.image_url.split("/").slice(-2).join("/");
        await supabase.storage.from("wardrobe-images").remove([path]);
      }

      const { error } = await supabase
        .from("wardrobe_items")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: "Peça removida",
        description: "O item não está mais no seu guarda-roupa.",
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "Erro ao remover peça",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDetails = () => {
    if (!loading) {
      setIsDetailsOpen(true);
    }
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetails();
    }
  };

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={openDetails}
        onKeyDown={handleCardKeyDown}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border-transparent bg-white/90 transition-shadow hover:shadow-[var(--shadow-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <div className="relative aspect-square overflow-hidden bg-surface-muted">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <Sparkles className="h-8 w-8" />
              <span className="text-sm font-medium">Sem imagem</span>
            </div>
          )}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute right-3 top-3 rounded-full bg-black/40 text-white transition hover:scale-110 hover:bg-black/60 ${
              item.favorite ? "text-secondary" : ""
            }`}
            onClick={(event) => {
              event.stopPropagation();
              void toggleFavorite();
            }}
            disabled={loading}
          >
            <Heart className={item.favorite ? "fill-current" : ""} />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                {item.name}
              </h3>
              <Badge variant="outline" className="rounded-full text-xs">
                {item.season}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="rounded-full px-2 py-1">
                {item.category}
              </Badge>
              <span className="rounded-full bg-surface-muted px-2 py-1">
                {item.color}
              </span>
              <span className="rounded-full bg-surface-muted px-2 py-1">
                Usado {item.usage_count}x
              </span>
            </div>

            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={`${item.id}-tag-${index}`}
                    variant="outline"
                    className="rounded-full text-xs"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-primary"
              onClick={(event) => {
                event.stopPropagation();
                void incrementUsage();
              }}
              disabled={loading}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-destructive"
              onClick={(event) => {
                event.stopPropagation();
                void deleteItem();
              }}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <ItemDetailsModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        item={item}
        onEdit={() => {
          setIsDetailsOpen(false);
          setIsEditOpen(true);
        }}
      />
      <EditItemModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        item={item}
        onSuccess={onUpdate}
      />
    </>
  );
};
