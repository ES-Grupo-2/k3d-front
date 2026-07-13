// Tela do Dashboard Financeiro: receita, custo, lucro, ticket e margem do
// período, com comparativo geral, receita por produto e detalhamento completo
// por produto. Restrito ao perfil Gerente.
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
  FinancialDashboardData,
  Period,
  ProductsBreakdownData,
} from "@/schemas/dashboard";
import { FinancialChart } from "./FinancialChart";
import { MetricCard } from "./MetricCard";
import { PeriodFilter } from "./PeriodFilter";
import { ProductsBarChart } from "./ProductsBarChart";
import { ProductsTable } from "./ProductsTable";

interface FinancialDashboardViewProps {
  period: Period;
  data: FinancialDashboardData | null;
  products: ProductsBreakdownData | null;
  error: string | null;
}

export function FinancialDashboardView({
  period,
  data,
  products,
  error,
}: FinancialDashboardViewProps) {
  const margin =
    data && data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;
  const productList = products?.products ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Financeiro</h1>
          <p className="text-muted-foreground text-sm">
            Receita, custo, lucro, ticket médio e margem
          </p>
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
            <CardTitle>Receita por produto</CardTitle>
          </CardHeader>
          <CardContent>
            {productList.length > 0 ? (
              <ProductsBarChart
                products={productList}
                dataKey="revenue"
                kind="currency"
                label="Receita"
              />
            ) : (
              <p className="text-muted-foreground py-12 text-center text-sm">
                Sem produtos no período selecionado.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento completo por produto</CardTitle>
        </CardHeader>
        <CardContent>
          {productList.length > 0 ? (
            <ProductsTable products={productList} variant="financial" />
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Sem produtos no período.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
