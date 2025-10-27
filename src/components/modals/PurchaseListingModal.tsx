import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Loader2, ShieldCheck } from "lucide-react";

type PaymentMethod = "pix" | "credit_card" | "boleto";

interface PurchaseListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    price: number;
    condition: string;
    status: "available" | "reserved" | "sold";
    owner_email: string | null;
    wardrobe_items: {
      id: string;
      name: string;
      category: string;
      color: string;
      season: string;
      image_url: string | null;
    } | null;
  } | null;
  onSuccess: () => void;
}

const paymentOptions: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    value: "pix",
    label: "Pix (instantâneo)",
    description: "Pagamento confirmado em poucos minutos após envio.",
  },
  {
    value: "credit_card",
    label: "Cartão de crédito",
    description: "Parcelamento em até 6x com taxa de 2,99% por parcela.",
  },
  {
    value: "boleto",
    label: "Boleto bancário",
    description: "Compensação em até 2 dias úteis com vencimento de 3 dias.",
  },
];

const instructionsByMethod: Record<
  PaymentMethod,
  { title: string; steps: string[]; extra?: string }
> = {
  pix: {
    title: "Finalize o pagamento com Pix",
    steps: [
      "Copie a chave apresentada abaixo.",
      "Abra o aplicativo do seu banco e escolha a opção Pix -> Colar código.",
      "Cole a chave, confirme o valor e finalize o pagamento.",
    ],
    extra: "Pagamentos Pix são compensados em até 5 minutos. Você receberá um e-mail com a confirmação.",
  },
  credit_card: {
    title: "Finalize o pagamento com cartão",
    steps: [
      "Clique no botão 'Ir para pagamento' para abrir o checkout seguro.",
      "Insira os dados do seu cartão e confirme a compra.",
      "O status será atualizado automaticamente assim que o pagamento for aprovado.",
    ],
    extra: "Aceitamos as principais bandeiras. Parcelamentos possuem taxa adicional de acordo com o número de parcelas.",
  },
  boleto: {
    title: "Finalize o pagamento com boleto",
    steps: [
      "Baixe ou copie o código de barras do boleto abaixo.",
      "Pague pelo app do seu banco ou em qualquer agência até a data de vencimento.",
      "Após compensação, o vendedor será notificado e a peça liberada.",
    ],
    extra: "O boleto vence em 3 dias. Caso não seja pago, a reserva será cancelada automaticamente.",
  },
};

const generateReference = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ref-${Math.random().toString(36).slice(2, 10)}`;
};

export const PurchaseListingModal = ({
  open,
  onOpenChange,
  listing,
  onSuccess,
}: PurchaseListingModalProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    method: PaymentMethod;
    amount: number;
  } | null>(null);

  useEffect(() => {
    if (!open) {
      setPaymentMethod("");
      setNotes("");
      setLoading(false);
      setConfirmation(null);
    }
  }, [open]);

  const selectedInstructions = useMemo(() => {
    if (!confirmation) return null;
    return instructionsByMethod[confirmation.method];
  }, [confirmation]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Código copiado para a área de transferência.",
      });
    } catch (error: any) {
      toast({
        title: "Não foi possível copiar",
        description: error?.message ?? "Tente copiar manualmente.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!listing || !paymentMethod) return;

    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Faça login para concluir a compra.");

      if (user.id === listing.user_id) {
        throw new Error("Você não pode comprar a própria peça.");
      }

      if (listing.status !== "available") {
        throw new Error("Este anúncio não está mais disponível para compra.");
      }

      // Verifica se já existe pedido ativo
      const { data: existingOrders, error: existingError } = await supabase
        .from("marketplace_orders")
        .select("id, payment_status")
        .eq("listing_id", listing.id)
        .eq("buyer_id", user.id)
        .in("payment_status", ["pending", "paid"]);

      if (existingError) throw existingError;

      if (existingOrders && existingOrders.length > 0) {
        throw new Error("Você já possui um pedido ativo para este anúncio.");
      }

      const amount = listing.price;

      const { data: reservationData, error: reservationError } = await supabase
        .from("marketplace_listings")
        .update({ status: "reserved" } as any)
        .eq("id", listing.id)
        .eq("status", "available")
        .select("id");

      if (reservationError) throw reservationError;
      if (!reservationData || reservationData.length === 0) {
        throw new Error("Outro comprador acabou de reservar esta peça. Tente novamente mais tarde.");
      }

      const reference = generateReference();

      const { error: orderError } = await supabase.from("marketplace_orders").insert({
        listing_id: listing.id,
        buyer_id: user.id,
        buyer_email: user.email,
        payment_method: paymentMethod,
        payment_status: "pending",
        amount,
        reference,
        buyer_notes: notes.trim() ? notes.trim() : null,
      } as any);

      if (orderError) {
        await supabase
          .from("marketplace_listings")
          .update({ status: "available" } as any)
          .eq("id", listing.id);
        throw orderError;
      }

      setNotes("");

      setConfirmation({
        reference,
        method: paymentMethod,
        amount,
      });

      toast({
        title: "Pedido criado!",
        description: "Reserve a peça realizando o pagamento na plataforma.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Não foi possível iniciar a compra",
        description: error.message ?? "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Comprar com pagamento seguro</DialogTitle>
          <DialogDescription>
            Pague diretamente pela plataforma e mantenha sua compra protegida.
          </DialogDescription>
        </DialogHeader>

        {listing ? (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    {listing.title || listing.wardrobe_items?.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">{listing.condition}</Badge>
                    {listing.wardrobe_items && (
                      <>
                        <Badge variant="outline">{listing.wardrobe_items.category}</Badge>
                        <Badge variant="outline">{listing.wardrobe_items.season}</Badge>
                      </>
                    )}
                  </div>
                  {listing.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {listing.description}
                    </p>
                  )}
                </div>
                <p className="text-xl font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(listing.price)}
                </p>
              </div>
            </div>

            {confirmation ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <div className="space-y-1">
                      <h4 className="font-semibold text-green-700">
                        Reserva confirmada! Complete o pagamento para liberar o envio.
                      </h4>
                      <p className="text-sm text-green-700">
                        O vendedor será notificado assim que o pagamento estiver aprovado.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">{selectedInstructions?.title}</h4>
                  <ol className="list-decimal space-y-2 pl-6 text-sm">
                    {selectedInstructions?.steps.map((step, index) => (
                      <li key={index} className="text-muted-foreground">
                        {step}
                      </li>
                    ))}
                  </ol>
                  {selectedInstructions?.extra && (
                    <p className="text-sm text-muted-foreground">{selectedInstructions.extra}</p>
                  )}
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">Código de pagamento</span>
                      <p className="font-mono text-lg">{confirmation.reference}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(confirmation.reference)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </Button>
                  </div>
                </div>

                {confirmation.method === "credit_card" && (
                  <Button asChild>
                    <a
                      href={`https://pagamentos.exemplo.com/checkout?ref=${confirmation.reference}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ir para pagamento
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <Label>Método de pagamento</Label>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                    {paymentOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-start justify-between rounded-lg border p-4 transition hover:border-primary"
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <div>
                            <Label htmlFor={option.value} className="cursor-pointer font-medium">
                              {option.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchase-notes">Observações para o vendedor (opcional)</Label>
                  <Textarea
                    id="purchase-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Ex: Preciso do produto até o próximo sábado. Pode enviar um recado ao embalar?"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
            Selecione uma oferta do marketplace para continuar.
          </div>
        )}

        <Separator />

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Fechar
          </Button>
          {!confirmation && (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !paymentMethod || !listing}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar compra"
              )}
            </Button>
          )}
          {confirmation && (
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Entendi, vou pagar
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
