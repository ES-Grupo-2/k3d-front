// Tela do Dashboard Operacional: volume de pedidos por categoria e por produto
// no período selecionado. Acessível a Gerente e Operacional. Reúne cards de
// totais, gráficos (por categoria e por produto) e tabelas de detalhamento.
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
import type {
  OperationalDashboardData,
  Period,
  ProductsBreakdownData,
} from "@/schemas/dashboard/dashboard";
import { CategoryTable } from "./CategoryTable";
import { MetricCard } from "./MetricCard";
import { OperationalChart } from "./OperationalChart";
import { PeriodFilter } from "./PeriodFilter";
import { ProductsBarChart } from "./ProductsBarChart";
import { ProductsTable } from "./ProductsTable";

interface OperationalDashboardViewProps {
  period: Period;
  data: OperationalDashboardData | null;
  products: ProductsBreakdownData | null;
  error: string | null;
}

export function OperationalDashboardView({
  period,
  data,
  products,
  error,
}: OperationalDashboardViewProps) {
  const categoriesCount = data?.byCategory.length ?? 0;
  const averagePerCategory =
    data && categoriesCount > 0
      ? (data.totalOrders / categoriesCount).toFixed(1)
      : "0";
  const productList = products?.products ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Operacional</h1>
          <p className="text-muted-foreground text-sm">
            Pedidos por categoria e por produto
          </p>
        </div>
        <PeriodFilter basePath="/dashboard" period={period} />
      </header>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível carregar os dados</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard title="Total no período" value={data?.totalOrders ?? 0} />
        <MetricCard title="Categorias ativas" value={categoriesCount} />
        <MetricCard title="Produtos distintos" value={productList.length} />
        <MetricCard title="Média por categoria" value={averagePerCategory} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
            <CardTitle>Quantidade por produto</CardTitle>
          </CardHeader>
          <CardContent>
            {productList.length > 0 ? (
              <ProductsBarChart
                products={productList}
                dataKey="quantity"
                kind="count"
                label="Quantidade"
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

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por produto</CardTitle>
        </CardHeader>
        <CardContent>
          {productList.length > 0 ? (
            <ProductsTable products={productList} variant="operational" />
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
