import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import { WardrobeItem } from "./WardrobeItem";
import { AddItemModal } from "./modals/AddItemModal";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { SectionHeader } from "./layout/SectionHeader";
import { EmptyState } from "./ui/empty-state";
import { Download, Plus, Search, Shirt, Upload } from "lucide-react";

interface Item {
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
}

const CATEGORIES = [
  "Todas",
  "Camisetas",
  "Calças",
  "Vestidos",
  "Sapatos",
  "Acessórios",
  "Jaquetas",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

const formatPlural = (value: number, singular: string, plural: string) =>
  value === 1 ? singular : plural;

export const Wardrobe = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("Todas");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("wardrobe_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data as Item[]) ?? []);
    } catch (error) {
      toast({
        title: "Erro ao carregar itens",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "Todas" || item.category === selectedCategory;

      if (!normalizedQuery) {
        return matchesCategory;
      }

      const inName = item.name.toLowerCase().includes(normalizedQuery);
      const inTags = item.tags.some((tag) =>
        tag.toLowerCase().includes(normalizedQuery)
      );

      return matchesCategory && (inName || inTags);
    });
  }, [items, searchQuery, selectedCategory]);

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `guarda-roupa-${new Date()
      .toISOString()
      .split("T")[0]}.json`;
    link.click();

    toast({
      title: "Exportação concluída",
      description: `${items.length} ${formatPlural(
        items.length,
        "peça",
        "peças"
      )} exportadas com sucesso.`,
    });
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      try {
        const content = target?.result;
        if (typeof content !== "string") {
          throw new Error("Arquivo inválido.");
        }

        const parsed = JSON.parse(content) as Partial<Item>[] | undefined;
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error("O arquivo selecionado não contém itens válidos.");
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("Usuário não autenticado.");
        }

        const itemsToInsert = parsed.map((item) => ({
          ...item,
          id: undefined,
          user_id: user.id,
          created_at: new Date().toISOString(),
        }));

        const { error } = await supabase
          .from("wardrobe_items")
          .insert(itemsToInsert);

        if (error) throw error;

        await loadItems();
        toast({
          title: "Importação concluída",
          description: `${itemsToInsert.length} ${formatPlural(
            itemsToInsert.length,
            "peça",
            "peças"
          )} foram adicionadas ao seu guarda-roupa.`,
        });
      } catch (error) {
        toast({
          title: "Erro ao importar",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  const hasItems = filteredItems.length > 0;

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Meu guarda-roupa"
        description="Organize peças, acompanhe usos e marque seus favoritos."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!items.length}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <label>
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova peça
            </Button>
          </div>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Busque por nome, tags ou categoria"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <Badge
              key={category}
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer rounded-full px-4 py-1 text-sm transition hover:scale-105"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={`wardrobe-skeleton-${index}`}
              className="aspect-square animate-pulse rounded-2xl bg-surface-muted"
            />
          ))}
        </div>
      ) : hasItems ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredItems.map((item) => (
            <WardrobeItem key={item.id} item={item} onUpdate={loadItems} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Shirt className="h-7 w-7 text-primary" />}
          title={
            items.length
              ? "Nenhuma peça encontrada"
              : "Adicione sua primeira peça"
          }
          description={
            items.length
              ? "Ajuste os filtros ou tente uma nova busca."
              : "Crie seu acervo digital e acompanhe o uso de cada item."
          }
          action={
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar peça
            </Button>
          }
        />
      )}

      <AddItemModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={loadItems}
      />
    </section>
  );
};
