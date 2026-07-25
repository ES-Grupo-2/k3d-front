/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
// Tela do Dashboard Operacional: volume de pedidos por categoria
// no período selecionado. Acessível a Gerente e Operacional. Reúne cards de
// totais, gráfico (por categoria) e tabela de detalhamento.
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type {
  DailyRevenueData,
  OperationalDashboardData,
  Period,
} from "@/schemas/dashboard/dashboard";
import { MobileMenuButton } from "@/components/navigation/mobile-nav";
import { CategoryTable } from "./CategoryTable";
import { DailyLineChart } from "./DailyLineChart";
import { MetricCard } from "./MetricCard";
import { OperationalChart } from "./OperationalChart";
import { PeriodFilter } from "./PeriodFilter";

interface OperationalDashboardViewProps {
  period: Period;
  data: OperationalDashboardData | null;
  daily: DailyRevenueData | null;
  error: string | null;
}

export function OperationalDashboardView({
  period,
  data,
  daily,
  error,
}: OperationalDashboardViewProps) {
  const categoriesCount = data?.byCategory.length ?? 0;
  const averagePerCategory =
    data && categoriesCount > 0
      ? (data.totalOrders / categoriesCount).toFixed(1)
      : "0";

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MobileMenuButton />
          <div>
            <h1 className="text-2xl font-bold">Dashboard Operacional</h1>
            <p className="text-muted-foreground text-sm">
              Pedidos e métricas por categoria
            </p>
          </div>
        </div>
        <PeriodFilter basePath="/dashboard" period={period} />
      </header>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível carregar os dados</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {/* Grid reajustado para 3 colunas (lg:grid-cols-3) já que removemos o card de produtos */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricCard title="Total no período" value={data?.totalOrders ?? 0} />
        <MetricCard title="Categorias ativas" value={categoriesCount} />
        <MetricCard title="Média por categoria" value={averagePerCategory} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos por dia</CardTitle>
        </CardHeader>
        <CardContent>
          {daily && daily.days.length > 0 ? (
            <DailyLineChart
              data={daily.days}
              dataKey="orders"
              kind="count"
              label="Pedidos"
            />
          ) : (
            <p className="text-muted-foreground py-12 text-center text-sm">
              Sem dados diários no período selecionado.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos por categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {data && data.byCategory.length > 0 ? (
            <OperationalChart data={data.byCategory} />
          ) : (
            <p className="text-muted-foreground py-12 text-center text-sm">
              Nenhum pedido no período selecionado.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {data && data.byCategory.length > 0 ? (
            <CategoryTable
              categories={data.byCategory}
              totalOrders={data.totalOrders}
            />
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Sem categorias no período.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}