// Página do Dashboard Operacional (rota /dashboard). Busca no servidor os dados
// operacionais e o breakdown por produto com o token da sessão e entrega à view.
// Acessível a Gerente e Operacional.
// Author: lukasnascimento1
import { OperationalDashboardView } from "@/components/dashboard";
import {
  type OperationalDashboardData,
  parsePeriod,
  type ProductsBreakdownData,
} from "@/schemas/dashboard";
import { requireAuth } from "@/services/auth/session";
import {
  getOperationalDashboard,
  getProductsBreakdown,
} from "@/services/dashboard";

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

  // Breakdown por produto é restrito a Gerente no backend; para Operacional a
  // chamada falha (403) e a seção de produtos simplesmente não aparece.
  let products: ProductsBreakdownData | null = null;
  try {
    products = await getProductsBreakdown(period, token);
  } catch {
    products = null;
  }

  return (
    <OperationalDashboardView
      period={period}
      data={data}
      products={products}
      error={error}
    />
  );
}
