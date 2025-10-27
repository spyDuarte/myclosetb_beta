import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateLookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  items: Array<{
    id: string;
    name: string;
    image_url: string | null;
  }>;
}

export const CreateLookModal = ({
  open,
  onOpenChange,
  onSuccess,
  items,
}: CreateLookModalProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast({
        title: "Selecione ao menos uma peça",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase.from("looks").insert({
        user_id: user.id,
        name,
        occasion: occasion || null,
        item_ids: selectedItems,
      });

      if (error) throw error;

      toast({
        title: "Look criado!",
        description: "Novo look adicionado à galeria.",
      });

      setName("");
      setOccasion("");
      setSelectedItems([]);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao criar look",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Look</DialogTitle>
          <DialogDescription>
            Selecione as peças para compor seu look
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Look</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="occasion">Ocasião (opcional)</Label>
            <Input
              id="occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Ex: Trabalho, Festa, Casual"
            />
          </div>

          <div className="space-y-2">
            <Label>Selecione as Peças</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2 border rounded-lg">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedItems.includes(item.id)
                      ? "border-primary shadow-lg scale-105"
                      : "border-transparent"
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="aspect-square bg-muted">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        👕
                      </div>
                    )}
                  </div>
                  <div className="absolute top-1 right-1">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      className="bg-white"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs truncate">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="text-sm text-muted-foreground">
              {selectedItems.length} {selectedItems.length === 1 ? "peça selecionada" : "peças selecionadas"}
            </p>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Look"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
