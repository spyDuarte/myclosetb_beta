import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SectionHeader } from "./layout/SectionHeader";
import { EmptyState } from "./ui/empty-state";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle2,
  CreditCard,
  Eye,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { CreateListingModal } from "./modals/CreateListingModal";
import { PurchaseListingModal } from "./modals/PurchaseListingModal";

interface WardrobeItemSummary {
  id: string;
  name: string;
  category: string;
  color: string;
  season: string;
  image_url: string | null;
}

interface MarketplaceListing {
  id: string;
  item_id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  condition: string;
  status: "available" | "reserved" | "sold";
  owner_email: string | null;
  created_at: string;
  wardrobe_items: WardrobeItemSummary | null;
}

type StatusFilter = MarketplaceListing["status"] | "all";

interface ListingItemOption extends WardrobeItemSummary {
  listed: boolean;
}

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const STATUS_LABELS: Record<MarketplaceListing["status"], string> = {
  available: "Disponível",
  reserved: "Reservado",
  sold: "Vendido",
};

const STATUS_BADGES: Record<MarketplaceListing["status"], string> = {
  available: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  reserved: "bg-amber-50 text-amber-700 border border-amber-100",
  sold: "bg-zinc-100 text-zinc-700 border border-zinc-200",
};

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "available", label: "Disponíveis" },
  { value: "reserved", label: "Reservados" },
  { value: "sold", label: "Vendidos" },
  { value: "all", label: "Todos" },
];

export const Marketplace = () => {
  const { toast } = useToast();

  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseListing, setPurchaseListing] =
    useState<MarketplaceListing | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userItems, setUserItems] = useState<ListingItemOption[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const loadCurrentUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUserId(user?.id ?? null);
  }, []);

  const loadListings = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) {
        setLoading(true);
      }

      try {
        const { data, error } = await supabase
          .from("marketplace_listings")
          .select(
            `
              id,
              item_id,
              user_id,
              title,
              description,
              price,
              condition,
              status,
              owner_email,
              created_at,
              wardrobe_items (
                id,
                name,
                category,
                color,
                season,
                image_url
              )
            `
          )
          .order("created_at", { ascending: false });

        if (error) throw error;

        const parsed =
          (data as MarketplaceListing[] | null)?.map((row) => ({
            ...row,
            price: Number(row.price),
            status: (row.status ?? "available") as MarketplaceListing["status"],
          })) ?? [];

        setListings(parsed);
      } catch (error) {
        toast({
          title: "Erro ao carregar anúncios",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } finally {
        if (showSpinner) {
          setLoading(false);
        }
        setRefreshing(false);
      }
    },
    [toast]
  );

  const loadUserItems = useCallback(async () => {
    if (loadingItems || !currentUserId) return;
    setLoadingItems(true);

    try {
      const { data, error } = await supabase
        .from("wardrobe_items")
        .select("id, name, category, color, season, image_url")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const mapped =
        (data as WardrobeItemSummary[] | null)?.map((item) => ({
          ...item,
          listed: listings.some(
            (listing) =>
              listing.item_id === item.id && listing.status !== "sold"
          ),
        })) ?? [];
      setUserItems(mapped);
    } catch (error) {
      toast({
        title: "Erro ao carregar peças",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoadingItems(false);
    }
  }, [currentUserId, listings, loadingItems, toast]);

  useEffect(() => {
    void loadCurrentUser();
    void loadListings(true);

    const channel = supabase
      .channel("marketplace_listings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "marketplace_listings" },
        () => {
          void loadListings();
        }
      );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadCurrentUser, loadListings]);

  useEffect(() => {
    if (!currentUserId) {
      setShowOnlyMine(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (isModalOpen) {
      void loadUserItems();
    }
  }, [isModalOpen, loadUserItems]);

  const stats = useMemo(() => {
    const availableListings = listings.filter(
      (listing) => listing.status === "available"
    );
    const reservedListings = listings.filter(
      (listing) => listing.status === "reserved"
    );
    const soldListings = listings.filter(
      (listing) => listing.status === "sold"
    );
    const mineListings = currentUserId
      ? listings.filter((listing) => listing.user_id === currentUserId)
      : [];

    const sumPrices = (total: number, listing: MarketplaceListing) =>
      total + (Number(listing.price) || 0);

    return {
      total: listings.length,
      available: availableListings.length,
      reserved: reservedListings.length,
      sold: soldListings.length,
      mine: mineListings.length,
      availableValue: availableListings.reduce(sumPrices, 0),
      reservedValue: reservedListings.reduce(sumPrices, 0),
      soldValue: soldListings.reduce(sumPrices, 0),
      mineValue: mineListings.reduce(sumPrices, 0),
    };
  }, [listings, currentUserId]);

  const highlightChips = useMemo(() => {
    const chips: Array<{
      label: string;
      icon: ComponentType<{ className?: string }>;
      className: string;
    }> = [
      {
        label: `${stats.total} ${
          stats.total === 1 ? "anúncio ativo" : "anúncios ativos"
        }`,
        icon: ShoppingBag,
        className:
          "bg-white/80 text-purple-800 border border-purple-100 shadow-sm shadow-purple-100/40",
      },
      {
        label: `${stats.available} disponíveis`,
        icon: CheckCircle2,
        className:
          "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm shadow-emerald-100/40",
      },
      {
        label: `${stats.reserved} reservados`,
        icon: RefreshCcw,
        className:
          "bg-amber-50 text-amber-700 border border-amber-100 shadow-sm shadow-amber-100/40",
      },
    ];

    if (stats.mine > 0) {
      chips.push({
        label: `${stats.mine} publicados por você`,
        icon: Eye,
        className:
          "bg-sky-50 text-sky-700 border border-sky-100 shadow-sm shadow-sky-100/40",
      });
    }

    return chips;
  }, [stats.available, stats.mine, stats.reserved, stats.total]);

  const summaryCards = useMemo(
    () =>
      [
        {
          title: "Anúncios ativos",
          value: stats.total,
          helper:
            stats.total === 1
              ? "Anúncio visível agora"
              : "Anúncios visíveis agora",
          accent: "bg-white text-purple-900 border border-purple-100 shadow-sm",
          icon: ShoppingBag,
        },
        {
          title: "Disponíveis",
          value: stats.available,
          helper: `Potencial de ${priceFormatter.format(
            stats.availableValue
          )}`,
          accent:
            "bg-emerald-50/70 text-emerald-900 border border-emerald-100 shadow-sm",
          icon: CheckCircle2,
        },
        {
          title: "Reservados",
          value: stats.reserved,
          helper:
            stats.reserved > 0
              ? `Em negociação (${priceFormatter.format(
                  stats.reservedValue
                )})`
              : "Nenhuma reserva ativa",
          accent:
            "bg-amber-50/70 text-amber-900 border border-amber-100 shadow-sm",
          icon: RefreshCcw,
        },
        {
          title: "Minhas vendas",
          value: stats.mine,
          helper:
            stats.sold > 0
              ? `${stats.sold} ${
                  stats.sold === 1 ? "venda concluída" : "vendas concluídas"
                }`
              : "Anuncie suas peças e acompanhe aqui",
          footer:
            stats.mineValue > 0
              ? `Carteira: ${priceFormatter.format(stats.mineValue)}`
              : undefined,
          accent: "bg-sky-50/70 text-sky-900 border border-sky-100 shadow-sm",
          icon: Eye,
        },
      ] satisfies Array<{
        title: string;
        value: number;
        helper: string;
        footer?: string;
        accent: string;
        icon: ComponentType<{ className?: string }>;
      }>,
    [
      stats.available,
      stats.availableValue,
      stats.mine,
      stats.mineValue,
      stats.reserved,
      stats.reservedValue,
      stats.sold,
      stats.total,
    ]
  );

  const filteredListings = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const min = parseFloat(minPrice.replace(",", "."));
    const max = parseFloat(maxPrice.replace(",", "."));
    const hasMin = minPrice.trim() !== "" && !Number.isNaN(min);
    const hasMax = maxPrice.trim() !== "" && !Number.isNaN(max);

    return listings.filter((listing) => {
      if (showOnlyMine && currentUserId && listing.user_id !== currentUserId) {
        return false;
      }

      if (statusFilter !== "all" && listing.status !== statusFilter) {
        return false;
      }

      if (hasMin && listing.price < min) {
        return false;
      }

      if (hasMax && listing.price > max) {
        return false;
      }

      if (!normalizedQuery) return true;

      const haystacks = [
        listing.title,
        listing.description ?? "",
        listing.wardrobe_items?.name ?? "",
        listing.wardrobe_items?.category ?? "",
        listing.wardrobe_items?.color ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystacks.includes(normalizedQuery);
    });
  }, [
    currentUserId,
    listings,
    maxPrice,
    minPrice,
    searchQuery,
    showOnlyMine,
    statusFilter,
  ]);

  const handleDelete = async (listingId: string) => {
    try {
      const confirmDelete = window.confirm(
        "Deseja remover este anúncio?"
      );
      if (!confirmDelete) return;

      const { error } = await supabase
        .from("marketplace_listings")
        .delete()
        .eq("id", listingId);

      if (error) throw error;

      toast({
        title: "Anúncio removido",
        description: "A peça não está mais visível no marketplace.",
      });

      await loadListings();
    } catch (error) {
      toast({
        title: "Erro ao remover anúncio",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleMarkStatus = async (
    listingId: string,
    nextStatus: MarketplaceListing["status"]
  ) => {
    try {
      const { error } = await supabase
        .from("marketplace_listings")
        .update({ status: nextStatus } as Partial<MarketplaceListing>)
        .eq("id", listingId);

      if (error) throw error;

      const statusText =
        nextStatus === "reserved"
          ? "Reserva realizada!"
          : nextStatus === "available"
          ? "Anúncio disponível novamente."
          : "Marcado como vendido!";

      toast({
        title: "Status atualizado",
        description: statusText,
      });

      await loadListings();
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    void loadListings(true);
  };

  const isOwner = useCallback(
    (listing: MarketplaceListing) => listing.user_id === currentUserId,
    [currentUserId]
  );

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Marketplace"
        description="Conecte-se com a comunidade e dê uma nova vida às suas peças."
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Novo anúncio
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        {highlightChips.map((chip, index) => (
          <Badge
            key={`${chip.label}-${index}`}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${chip.className}`}
          >
            <chip.icon className="h-4 w-4" />
            {chip.label}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => (
          <Card
            key={card.title}
            className={`flex flex-col justify-between rounded-3xl p-5 ${card.accent}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/80">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-semibold">{card.value}</p>
              </div>
              <card.icon className="h-10 w-10 text-current opacity-70" />
            </div>
            <p className="mt-6 text-sm text-foreground/70">{card.helper}</p>
            {card.footer && (
              <p className="mt-2 text-xs font-medium text-foreground/60">
                {card.footer}
              </p>
            )}
          </Card>
        ))}
      </div>

      <Card className="border-transparent bg-white/90 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-2 lg:max-w-md">
            <label className="text-sm font-medium text-muted-foreground">
              Buscar anúncios
            </label>
            <Input
              placeholder="Digite título, categoria ou cor"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Preço mínimo
              </label>
              <Input
                placeholder="0,00"
                inputMode="decimal"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Preço máximo
              </label>
              <Input
                placeholder="999,00"
                inputMode="decimal"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-between rounded-2xl bg-surface-muted px-4 py-3 lg:w-auto">
            <div>
              <p className="text-sm font-medium text-foreground">
                Mostrar somente meus anúncios
              </p>
              <p className="text-xs text-muted-foreground">
                Requer autenticação
              </p>
            </div>
            <Switch
              checked={showOnlyMine}
              onCheckedChange={setShowOnlyMine}
              disabled={!currentUserId}
            />
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="lg:w-auto"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {refreshing ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>

        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          className="w-full px-6 pb-6"
        >
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl bg-surface-muted p-2 text-sm sm:grid-cols-4">
            {STATUS_OPTIONS.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="rounded-xl py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={`listing-skeleton-${index}`}
              className="space-y-4 rounded-3xl border-transparent bg-white/70 p-6 shadow-sm"
            >
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      ) : filteredListings.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((listing) => {
            const owner = isOwner(listing);

            return (
              <Card
                key={listing.id}
                className="flex h-full flex-col justify-between rounded-3xl border-transparent bg-white/90 p-6 shadow-[var(--shadow-card)]"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {listing.description ?? "Sem descrição adicional."}
                      </p>
                    </div>
                    <Badge
                      className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGES[listing.status]}`}
                    >
                      {STATUS_LABELS[listing.status]}
                    </Badge>
                  </div>

                  {listing.wardrobe_items?.image_url ? (
                    <img
                      src={listing.wardrobe_items.image_url}
                      alt={listing.wardrobe_items.name}
                      className="h-48 w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground">
                      <Sparkles className="h-10 w-10" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-semibold text-foreground">
                        {priceFormatter.format(listing.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {listing.condition}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        {listing.wardrobe_items?.image_url ? (
                          <AvatarImage
                            src={listing.wardrobe_items.image_url}
                            alt={listing.wardrobe_items.name}
                          />
                        ) : (
                          <AvatarFallback>
                            {listing.wardrobe_items?.name
                              ?.slice(0, 2)
                              .toUpperCase() ?? "MC"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="text-sm leading-tight">
                        <p className="font-medium text-foreground">
                          {listing.wardrobe_items?.name ?? "Peça sem nome"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(listing.created_at),
                            "dd MMM yyyy",
                            { locale: ptBR }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    variant={owner ? "outline" : "default"}
                    onClick={() => setPurchaseListing(listing)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {owner ? "Visualizar detalhes" : "Quero comprar"}
                  </Button>

                  {owner ? (
                    <div className="flex flex-wrap gap-2">
                      {listing.status === "available" && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              void handleMarkStatus(listing.id, "reserved")
                            }
                          >
                            Reservar
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              void handleMarkStatus(listing.id, "sold")
                            }
                          >
                            Marcar como vendido
                          </Button>
                        </>
                      )}

                      {listing.status === "reserved" && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              void handleMarkStatus(listing.id, "sold")
                            }
                          >
                            Concluir venda
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              void handleMarkStatus(listing.id, "available")
                            }
                          >
                            Disponibilizar novamente
                          </Button>
                        </>
                      )}

                      {listing.status === "sold" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            void handleMarkStatus(listing.id, "available")
                          }
                        >
                          Reativar anúncio
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => void handleDelete(listing.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7 text-primary" />}
          title="Nenhum anúncio encontrado"
          description="Ajuste os filtros ou seja o primeiro a publicar uma peça exclusiva."
          action={
            <Button onClick={() => setIsModalOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4" />
              Criar anúncio
            </Button>
          }
        />
      )}

      <CreateListingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={loadListings}
        items={userItems}
        loadingItems={loadingItems}
        onLoadItems={loadUserItems}
      />

      <PurchaseListingModal
        open={Boolean(purchaseListing)}
        onOpenChange={(open) => {
          if (!open) {
            setPurchaseListing(null);
          }
        }}
        listing={purchaseListing}
        onSuccess={loadListings}
      />
    </section>
  );
};
