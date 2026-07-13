// Serviço de acesso aos dashboards no backend. Busca os dados agregados
// (operacional e financeiro) no servidor, autenticando com o token da sessão.
// É o único ponto que fala com os endpoints /dashboard/* da API.
// Author: lukasnascimento1
import type {
  FinancialDashboardData,
  OperationalDashboardData,
  Period,
  ProductsBreakdownData,
} from "@/schemas/dashboard";
import { authHttp } from "@/services/auth/http";

// Busca a agregação operacional (pedidos por categoria) do período informado.
export function getOperationalDashboard(
  period: Period,
  token: string,
): Promise<OperationalDashboardData> {
  return authHttp<OperationalDashboardData>(
    `/dashboard/operational?period=${period}`,
    { token },
  );
}

// Busca os indicadores financeiros (receita, custo, lucro, ticket) do período.
export function getFinancialDashboard(
  period: Period,
  token: string,
): Promise<FinancialDashboardData> {
  return authHttp<FinancialDashboardData>(
    `/dashboard/financial?period=${period}`,
    { token },
  );
}

// Busca o detalhamento por produto (receita, custo, lucro, margem, quantidade).
// Requer perfil Gerente no backend.
export function getProductsBreakdown(
  period: Period,
  token: string,
): Promise<ProductsBreakdownData> {
  return authHttp<ProductsBreakdownData>(
    `/dashboard/financial/products?period=${period}`,
    { token },
  );
}
