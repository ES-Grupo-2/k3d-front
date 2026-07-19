// Página do Dashboard Operacional (rota /dashboard). Busca no servidor os dados
// operacionais com o token da sessão e entrega à view.
// Acessível a Gerente e Operacional.
import { OperationalDashboardView } from "@/components/dashboard";
import {
  type OperationalDashboardData,
  parsePeriod,
} from "@/schemas/dashboard/dashboard";
import { requireAuth } from "@/services/auth/session";
import { getOperationalDashboard } from "@/services/dashboard";

interface DashboardPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { token } = await requireAuth();
  const period = parsePeriod((await searchParams).period);

  let data: OperationalDashboardData | null = null;
  let error: string | null = null;

  try {
    data = await getOperationalDashboard(period, token);
  } catch (requestError) {
    error =
      requestError instanceof Error
        ? requestError.message
        : "Erro ao carregar o dashboard.";
  }

  // Feature de Produtos removida devido à ausência de endpoint no backend.

  return (
    <OperationalDashboardView
      period={period}
      data={data}
      error={error}
    />
  );
}