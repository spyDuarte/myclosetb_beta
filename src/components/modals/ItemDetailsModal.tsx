import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface ItemDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  onEdit?: () => void;
}

export const ItemDetailsModal = ({
  open,
  onOpenChange,
  item,
  onEdit,
}: ItemDetailsModalProps) => {
  const createdDate = new Date(item.created_at);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            Veja todas as informações cadastradas sobre esta peça
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-[200px,1fr]">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl">
                👕
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Categoria:</span>{" "}
                <span className="font-medium">{item.category}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cor:</span>{" "}
                <span className="font-medium">{item.color}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Estação:</span>{" "}
                <span className="font-medium">{item.season}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Usos registrados:</span>{" "}
                <span className="font-medium">{item.usage_count}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Favorito:</span>{" "}
                <span className="font-medium">
                  {item.favorite ? "Sim" : "Não"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Adicionada em:</span>{" "}
                <span className="font-medium">
                  {createdDate.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {item.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {onEdit && (
          <div className="flex justify-end border-t pt-4">
            <Button onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar informações
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
