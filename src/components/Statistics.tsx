import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SectionHeader } from "./layout/SectionHeader";
import { EmptyState } from "./ui/empty-state";
import { Badge } from "./ui/badge";
import { getErrorMessage } from "@/lib/utils";
import {
  Heart,
  LineChart,
  Shirt,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface Stats {
  total: number;
  favorites: number;
  looks: number;
  totalUsage: number;
  byCategory: Record<string, number>;
  topUsed: Array<{ name: string; count: number }>;
  recent: Array<{ name: string; created_at: string }>;
}

const DEFAULT_STATS: Stats = {
  total: 0,
  favorites: 0,
  looks: 0,
  totalUsage: 0,
  byCategory: {},
  topUsed: [],
  recent: [],
};

export const Statistics = () => {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsResult, looksResult] = await Promise.all([
        supabase.from("wardrobe_items").select("*"),
        supabase.from("looks").select("*"),
      ]);

      if (itemsResult.error) throw itemsResult.error;
      if (looksResult.error) throw looksResult.error;

      const items = (itemsResult.data ?? []) as Array<{
        name: string;
        category: string;
        usage_count: number;
        favorite: boolean;
        created_at: string;
      }>;

      const looks = looksResult.data ?? [];

      const byCategory = items.reduce<Record<string, number>>(
        (acc, item) => {
          acc[item.category] = (acc[item.category] ?? 0) + 1;
          return acc;
        },
        {}
      );

      const topUsed = [...items]
        .sort((a, b) => b.usage_count - a.usage_count)
        .slice(0, 3)
        .map((item) => ({
          name: item.name,
          count: item.usage_count,
        }));

      const recent = [...items]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        .slice(0, 5)
        .map((item) => ({
          name: item.name,
          created_at: item.created_at,
        }));

      setStats({
        total: items.length,
        favorites: items.filter((item) => item.favorite).length,
        looks: looks.length,
        totalUsage: items.reduce(
          (totalUsage, item) => totalUsage + (item.usage_count ?? 0),
          0
        ),
        byCategory,
        topUsed,
        recent,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      const message = getErrorMessage(error);
      if (message) {
        console.error(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const hasData = stats.total > 0;

  return (
    <section className="space-y-8">
      <SectionHeader
        title="Estatísticas"
        description="Insights em tempo real sobre o desempenho do seu guarda-roupa."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-transparent bg-white/90 shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de peças
            </CardTitle>
            <Shirt className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-white/90 shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Favoritos
            </CardTitle>
            <Heart className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.favorites}</p>
            <p className="text-sm text-muted-foreground">
              {hasData
                ? `${Math.round((stats.favorites / stats.total) * 100)}% do acervo`
                : "Sem favoritos cadastrados"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-white/90 shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Looks criados
            </CardTitle>
            <Sparkles className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.looks}</p>
          </CardContent>
        </Card>

        <Card className="border-transparent bg-white/90 shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Uso acumulado
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.totalUsage}</p>
            <p className="text-sm text-muted-foreground">
              Total de vezes que suas peças foram usadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-transparent bg-white/90 shadow-[var(--shadow-card)]">
          <CardHeader className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Distribuição por categoria
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Entenda em quais categorias você investe mais.
              </p>
            </div>
            <Badge variant="outline" className="bg-surface-muted text-xs">
              Panorama
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasData ? (
              Object.entries(stats.byCategory)
                .sort(([, countA], [, countB]) => countB - countA)
                .map(([category, count]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium text-foreground">
                      <span>{category}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-surface-muted">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((count / stats.total) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
            ) : (
              <EmptyState
                icon={<LineChart className="h-6 w-6 text-primary" />}
                title="Sem dados suficientes"
                description="Cadastre peças para visualizar os gráficos por categoria."
                className="border-none bg-surface-muted/70 py-10 shadow-none"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-transparent bg-white/90 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              Peças em destaque
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Liste suas peças mais usadas e crie estratégias para rotatividade.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topUsed.length ? (
              stats.topUsed.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface-muted/80 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white shadow-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {item.count} {item.count === 1 ? "uso" : "usos"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<Sparkles className="h-6 w-6 text-primary" />}
                title="Nenhuma peça destacada"
                description="Marque favoritos e registre usos para descobrir tendências."
                className="border-none bg-surface-muted/70 py-10 shadow-none"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-transparent bg-white/90 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Itens adicionados recentemente
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Acompanhe as últimas peças incluídas no guarda-roupa.
          </p>
        </CardHeader>
        <CardContent>
          {stats.recent.length ? (
            <div className="space-y-3">
              {stats.recent.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface-muted/80 px-4 py-3"
                >
                  <span className="font-medium text-foreground">
                    {item.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Shirt className="h-6 w-6 text-primary" />}
              title="Sem registros recentes"
              description="Assim que novas peças forem cadastradas, elas aparecerão aqui."
              className="border-none bg-surface-muted/70 py-10 shadow-none"
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
};
