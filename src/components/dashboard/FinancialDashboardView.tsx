// Tela do Dashboard Financeiro: receita, custo, lucro, ticket e margem do
// período, com a série diária de receita, o comparativo geral e a receita por
// categoria. Restrito ao perfil Gerente.
// Author: lukasnascimento1
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { currency } from "@/lib/utils";
import type {
  CategoryRevenueData,
  DailyRevenueData,
  FinancialDashboardData,
  Period,
} from "@/schemas/dashboard/dashboard";
import { MobileMenuButton } from "@/components/navigation/mobile-nav";
import { CategoryRevenueChart } from "./CategoryRevenueChart";
import { DailyLineChart } from "./DailyLineChart";
import { FinancialChart } from "./FinancialChart";
import { MetricCard } from "./MetricCard";
import { PeriodFilter } from "./PeriodFilter";

interface FinancialDashboardViewProps {
  period: Period;
  data: FinancialDashboardData | null;
  categories: CategoryRevenueData | null;
  daily: DailyRevenueData | null;
  error: string | null;
}

export function FinancialDashboardView({
  period,
  data,
  categories,
  daily,
  error,
}: FinancialDashboardViewProps) {
  const margin =
    data && data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;
  const categoryList = categories?.categories ?? [];

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MobileMenuButton />
          <div>
            <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
            <p className="text-muted-foreground text-sm">
              Receita, custo, lucro, ticket médio e margem
            </p>
          </div>
        </div>
        <PeriodFilter basePath="/relatorios" period={period} />
      </header>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível carregar os dados</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Receita" value={currency(data?.revenue ?? 0)} />
        <MetricCard title="Custo" value={currency(data?.cost ?? 0)} />
        <MetricCard title="Lucro" value={currency(data?.profit ?? 0)} />
        <MetricCard
          title="Ticket médio"
          value={currency(data?.averageTicket ?? 0)}
        />
        <MetricCard title="Margem de lucro" value={`${margin.toFixed(1)}%`} />
        <MetricCard title="Pedidos" value={data?.totalOrders ?? 0} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receita por dia</CardTitle>
        </CardHeader>
        <CardContent>
          {daily && daily.days.length > 0 ? (
            <DailyLineChart
              data={daily.days}
              dataKey="revenue"
              kind="currency"
              label="Receita"
            />
          ) : (
            <p className="text-muted-foreground py-12 text-center text-sm">
              Sem dados diários no período selecionado.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Comparativo</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <FinancialChart data={data} />
            ) : (
              <p className="text-muted-foreground py-12 text-center text-sm">
                Sem dados financeiros no período selecionado.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryList.length > 0 ? (
              <CategoryRevenueChart categories={categoryList} />
            ) : (
              <p className="text-muted-foreground py-12 text-center text-sm">
                Sem receita por categoria no período selecionado.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
