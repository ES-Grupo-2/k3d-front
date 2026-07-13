// Página do Dashboard Financeiro (rota /relatorios). Restrita ao perfil Gerente:
// busca no servidor os indicadores financeiros e o detalhamento por produto e
// entrega à view.
// Author: lukasnascimento1
import { FinancialDashboardView } from "@/components/dashboard";
import {
  type FinancialDashboardData,
  parsePeriod,
  type ProductsBreakdownData,
} from "@/schemas/dashboard";
import { requireRole } from "@/services/auth/session";
import {
  getFinancialDashboard,
  getProductsBreakdown,
} from "@/services/dashboard";

interface RelatoriosPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function RelatoriosPage({
  searchParams,
}: RelatoriosPageProps) {
  // Rota exclusiva do perfil Gerente (redireciona os demais para /inicio).
  const { token } = await requireRole("GERENTE");
  const period = parsePeriod((await searchParams).period);

  let data: FinancialDashboardData | null = null;
  let products: ProductsBreakdownData | null = null;
  let error: string | null = null;

  try {
    [data, products] = await Promise.all([
      getFinancialDashboard(period, token),
      getProductsBreakdown(period, token),
    ]);
  } catch (requestError) {
    error =
      requestError instanceof Error
        ? requestError.message
        : "Erro ao carregar o dashboard.";
  }

  return (
    <FinancialDashboardView
      period={period}
      data={data}
      products={products}
      error={error}
    />
  );
}
