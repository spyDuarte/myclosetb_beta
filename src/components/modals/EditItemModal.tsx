import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { categories, seasons } from "./itemOptions";

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  item: {
    id: string;
    name: string;
    category: string;
    color: string;
    season: string;
    image_url: string | null;
    tags: string[];
  };
}

export const EditItemModal = ({
  open,
  onOpenChange,
  onSuccess,
  item,
}: EditItemModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [color, setColor] = useState(item.color);
  const [season, setSeason] = useState(item.season);
  const [tags, setTags] = useState(item.tags.join(", "));
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  useEffect(() => {
    if (open) {
      setName(item.name);
      setCategory(item.category);
      setColor(item.color);
      setSeason(item.season);
      setTags(item.tags.join(", "));
      setNewImageFile(null);
      setRemoveCurrentImage(false);
    } else {
      setNewImageFile(null);
      setRemoveCurrentImage(false);
    }
  }, [item, open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);

      const formattedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      let updatedImageUrl = item.image_url;
      let imagePathToRemove: string | null = null;

      if (removeCurrentImage && item.image_url) {
        imagePathToRemove = item.image_url.split("/").slice(-2).join("/");
        updatedImageUrl = null;
      }

      if (newImageFile) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Usuário não autenticado");

        const fileExt = newImageFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("wardrobe-images")
          .upload(fileName, newImageFile, { upsert: false });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("wardrobe-images").getPublicUrl(fileName);

        updatedImageUrl = publicUrl;

        if (item.image_url && !removeCurrentImage) {
          imagePathToRemove = item.image_url.split("/").slice(-2).join("/");
        }
      }

      const { error } = await supabase
        .from("wardrobe_items")
        .update({
          name,
          category,
          color,
          season,
          tags: formattedTags,
          image_url: updatedImageUrl,
        } as any)
        .eq("id", item.id);

      if (error) throw error;

      if (imagePathToRemove) {
        await supabase.storage.from("wardrobe-images").remove([imagePathToRemove]);
      }

      toast({
        title: "Peça atualizada!",
        description: "As informações foram salvas com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Erro ao atualizar",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Peça</DialogTitle>
          <DialogDescription>
            Atualize as informações desta peça
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="edit-category">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-color">Cor</Label>
            <Input
              id="edit-color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-season">Estação</Label>
            <Select value={season} onValueChange={setSeason} required>
              <SelectTrigger id="edit-season">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((seasonOption) => (
                  <SelectItem key={seasonOption} value={seasonOption}>
                    {seasonOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags (separadas por vírgula)</Label>
            <Input
              id="edit-tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="casual, trabalho, festa"
            />
          </div>

          <div className="space-y-2">
            <Label>Foto</Label>
            {item.image_url && !removeCurrentImage && !newImageFile && (
              <div className="h-36 w-36 overflow-hidden rounded-lg border">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {newImageFile ? newImageFile.name : "Escolher nova imagem"}
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setNewImageFile(file);
                    if (file) {
                      setRemoveCurrentImage(false);
                    }
                  }}
                />
              </label>
              {item.image_url && (
                <Button
                  type="button"
                  variant={removeCurrentImage ? "default" : "ghost"}
                  className="sm:w-auto"
                  onClick={() => {
                    if (removeCurrentImage) {
                      setRemoveCurrentImage(false);
                    } else {
                      setRemoveCurrentImage(true);
                      setNewImageFile(null);
                    }
                  }}
                >
                  {removeCurrentImage ? "Manter foto" : "Remover foto"}
                </Button>
              )}
            </div>

            {removeCurrentImage && (
              <p className="text-xs text-muted-foreground">
                A foto atual será removida ao salvar.
              </p>
            )}
            {newImageFile && (
              <p className="text-xs text-muted-foreground">
                A nova imagem substituirá a atual ao salvar.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
