import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface ListingItemOption {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
  season: string;
  listed: boolean;
}

interface CreateListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  items: ListingItemOption[];
  loadingItems: boolean;
  onLoadItems: () => void;
}

const conditionOptions = ["Novo", "Como novo", "Pouco uso", "Bem usado"];

export const CreateListingModal = ({
  open,
  onOpenChange,
  onSuccess,
  items,
  loadingItems,
  onLoadItems,
}: CreateListingModalProps) => {
  const { toast } = useToast();
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      onLoadItems();
    }
  }, [open, onLoadItems]);

  const availableItems = useMemo(
    () => items.filter((item) => !item.listed),
    [items]
  );

  useEffect(() => {
    if (!open) {
      setSelectedItemId("");
      setTitle("");
      setDescription("");
      setPrice("");
      setCondition("");
      setSubmitting(false);
      return;
    }

    if (!selectedItemId) {
      const firstAvailable = availableItems[0];
      if (firstAvailable) {
        setSelectedItemId(firstAvailable.id);
      }
    }
  }, [open, availableItems, selectedItemId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedItemId) return;

    try {
      setSubmitting(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Usuário não autenticado");

      const numericPrice = Number(price.replace(",", "."));
      if (Number.isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error("Informe um preço válido.");
      }

      const { error } = await supabase.from("marketplace_listings").insert({
        user_id: user.id,
        item_id: selectedItemId,
        title: title || items.find((item) => item.id === selectedItemId)?.name,
        description,
        price: numericPrice,
        condition,
        owner_email: user.email,
      } as any);

      if (error) throw error;

      toast({
        title: "Oferta criada!",
        description: "Sua peça está agora no marketplace.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao criar oferta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedItem = items.find((item) => item.id === selectedItemId);
  const suggestedTitle = selectedItem ? `${selectedItem.name} - ${selectedItem.category}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl overflow-hidden rounded-3xl border border-purple-100 bg-gradient-to-br from-white via-purple-50/40 to-purple-100/20 p-0 shadow-2xl">
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-40 w-40 rounded-full bg-purple-200/50 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -left-14 h-44 w-44 rounded-full bg-rose-200/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-6 p-8 sm:p-10">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-bold text-purple-950 sm:text-3xl">
              Nova oferta no marketplace
            </DialogTitle>
            <DialogDescription className="text-sm text-purple-900/80">
              Escolha uma peça do seu guarda-roupa para anunciar e destaque os pontos que valorizam a venda.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 rounded-2xl border border-purple-100 bg-white/70 p-5 shadow-inner">
              <span className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                Peça do guarda-roupa
              </span>
              {loadingItems ? (
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando itens...
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 px-4 py-3 text-sm text-muted-foreground">
                  Você ainda não adicionou peças ao seu guarda-roupa.
                </div>
              ) : availableItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 px-4 py-3 text-sm text-muted-foreground">
                  Todas as suas peças já estão anunciadas. Remova um anúncio existente para criar outro.
                </div>
              ) : (
                <Select value={selectedItemId} onValueChange={setSelectedItemId} required>
                  <SelectTrigger className="h-12 rounded-2xl border border-purple-200 bg-purple-50/30 text-left text-sm font-medium text-purple-900 shadow-sm focus:ring-purple-200">
                    <SelectValue placeholder="Selecione a peça" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 rounded-2xl border border-purple-100 bg-white shadow-lg">
                    {items.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        disabled={item.listed}
                        className="rounded-xl px-4 py-3 text-sm data-[disabled]:opacity-60"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.category} • {item.season}
                          </span>
                          {item.listed && (
                            <span className="text-xs font-medium text-purple-600">
                              Já anunciada
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-6 rounded-2xl border border-purple-100 bg-white/80 p-5 shadow-inner">
              <div className="grid gap-2">
                <Label htmlFor="listing-title" className="text-sm font-semibold text-purple-900">
                  Título do anúncio
                </Label>
                <Input
                  id="listing-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={suggestedTitle || "Informe um título atrativo"}
                  className="h-12 rounded-2xl border border-purple-200 bg-purple-50/30 text-sm focus:border-purple-400 focus:ring-purple-200"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="listing-description" className="text-sm font-semibold text-purple-900">
                  Descrição
                </Label>
                <Textarea
                  id="listing-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Conte mais detalhes sobre a peça, motivos da venda ou medidas."
                  rows={4}
                  className="rounded-2xl border border-purple-200 bg-purple-50/30 text-sm focus:border-purple-400 focus:ring-purple-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="listing-price" className="text-sm font-semibold text-purple-900">
                    Preço (R$)
                  </Label>
                  <Input
                    id="listing-price"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="150"
                    required
                    className="h-12 rounded-2xl border border-purple-200 bg-purple-50/30 text-sm focus:border-purple-400 focus:ring-purple-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="listing-condition" className="text-sm font-semibold text-purple-900">
                    Condição
                  </Label>
                  <Select value={condition} onValueChange={setCondition} required>
                    <SelectTrigger
                      id="listing-condition"
                      className="h-12 rounded-2xl border border-purple-200 bg-purple-50/30 text-left text-sm font-medium text-purple-900 focus:border-purple-400 focus:ring-purple-200"
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-purple-100 bg-white shadow-lg">
                      {conditionOptions.map((option) => (
                        <SelectItem key={option} value={option} className="rounded-xl px-4 py-2 text-sm">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {selectedItem && (
              <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-white via-purple-50/40 to-purple-100/30 p-5 shadow-inner">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                    Resumo da peça
                  </span>
                  <Badge className="rounded-full bg-purple-100 text-purple-700">
                    {selectedItem.category}
                  </Badge>
                  <Badge className="rounded-full border border-purple-200 bg-white text-purple-600">
                    {selectedItem.season}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Use um título que destaque a peça e informe um preço compatível com a condição selecionada.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full border-purple-200 text-purple-700 hover:border-purple-300"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:from-purple-500/90 hover:to-purple-600/90"
                disabled={submitting || availableItems.length === 0}
              >
                {submitting ? "Publicando..." : "Publicar oferta"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
