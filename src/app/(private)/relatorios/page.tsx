// Página do Dashboard Financeiro (rota /relatorios). Restrita ao perfil Gerente:
// busca no servidor os indicadores financeiros, a série diária de receita e a
// receita por categoria, e entrega à view.
// Author: lukasnascimento1
import { FinancialDashboardView } from "@/components/dashboard";
import {
  type CategoryRevenueData,
  type DailyRevenueData,
  type FinancialDashboardData,
  parsePeriod,
} from "@/schemas/dashboard/dashboard";
import { requireRole } from "@/services/auth/session";
import {
  getCategoryRevenue,
  getDailyRevenue,
  getFinancialDashboard,
} from "@/services/dashboard";

interface RelatoriosPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function RelatoriosPage({
  searchParams,
}: RelatoriosPageProps) {
  // Rota exclusiva do perfil Gerente (redireciona os demais para /home).
  const { token } = await requireRole("GERENTE");
  const period = parsePeriod((await searchParams).period);

  let data: FinancialDashboardData | null = null;
  let categories: CategoryRevenueData | null = null;
  let daily: DailyRevenueData | null = null;
  let error: string | null = null;

  try {
    [data, categories, daily] = await Promise.all([
      getFinancialDashboard(period, token),
      getCategoryRevenue(period, token),
      getDailyRevenue(period, token),
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
      categories={categories}
      daily={daily}
      error={error}
    />
  );
}
