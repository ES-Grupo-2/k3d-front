/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
// Página do Dashboard Operacional (rota /dashboard). Busca no servidor os dados
// operacionais com o token da sessão e entrega à view.
// Acessível a Gerente e Operacional.
import { OperationalDashboardView } from "@/components/dashboard";
import {
  type DailyRevenueData,
  type OperationalDashboardData,
  parsePeriod,
} from "@/schemas/dashboard/dashboard";
import { requireAuth } from "@/services/auth/session";
import { getDailyRevenue, getOperationalDashboard } from "@/services/dashboard";

interface DashboardPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { token } = await requireAuth();
  const period = parsePeriod((await searchParams).period);

  let data: OperationalDashboardData | null = null;
  let daily: DailyRevenueData | null = null;
  let error: string | null = null;

  try {
    [data, daily] = await Promise.all([
      getOperationalDashboard(period, token),
      getDailyRevenue(period, token),
    ]);
  } catch (requestError) {
    error =
      requestError instanceof Error
        ? requestError.message
        : "Erro ao carregar o dashboard.";
  }

  return (
    <OperationalDashboardView
      period={period}
      data={data}
      daily={daily}
      error={error}
    />
  );
}