// Serviço de acesso aos dashboards no backend. Busca os dados agregados
// (operacional e financeiro) no servidor, autenticando com o token da sessão.
// É o único ponto que fala com os endpoints /dashboard/* da API.
// Author: lukasnascimento1
import type {
  FinancialDashboardData,
  OperationalDashboardData,
  Period,
  ProductsBreakdownData,
} from "@/schemas/dashboard/dashboard";
import { authHttp } from "@/services/auth/http";
import type { 
  OperationalDashboardApiData,
  OperationalTagsApiData,
  FinancialDashboardApiData, 
  ProductsBreakdownApiData, 
  ProductBreakdownApi } from "@/types/dashboard"; 

const periodToPeriodo: Record<Period, string> = {
  WEEKLY: "SEMANAL",
  MONTHLY: "MENSAL",
  SEMIANNUAL: "SEMESTRAL",
};

// Busca a agregação operacional (pedidos por categoria) do período informado.
export async function getOperationalDashboard(
  period: Period,
  token: string,
): Promise<OperationalDashboardData> {
  const backendData = await authHttp<OperationalDashboardApiData>(
    `/dashboard/operacional?periodo=${periodToPeriodo[period]}`,
    { token },
  );
  return {
    period: period,
    totalOrders: backendData.totalPedidos,
    byCategory: backendData.tags.map((tag: OperationalTagsApiData, idx) => ({
      tagId: String(idx+1),
      name: tag.tagType, 
      color: "#ffc94d", // Placeholder color since backend doesn't provide it
      total: tag.quantidade,
    })),
  };
}

// Busca os indicadores financeiros (receita, custo, lucro, ticket) do período.
export async function getFinancialDashboard(
  period: Period,
  token: string,
): Promise<FinancialDashboardData> {
  const backendData = await authHttp<FinancialDashboardApiData>(
    `/dashboard/financeiro?periodo=${periodToPeriodo[period]}`,
    { token },
  );

  return {
    period: period,
    revenue: backendData.receitaTotal,
    cost: backendData.custoTotal,
    profit: backendData.lucroTotal,
    averageTicket: backendData.ticketMedio,
    totalOrders: backendData.totalPedidos,
  };
}

// Busca o detalhamento por produto (receita, custo, lucro, margem, quantidade).
// Requer perfil Gerente no backend.
export async function getProductsBreakdown(
  period: Period,
  token: string,
): Promise<ProductsBreakdownData> {
  try {
    const backendData = await authHttp<ProductsBreakdownApiData>(
      `/dashboard/financeiro/produtos?periodo=${periodToPeriodo[period]}`,
      { token },
    );

    return {
      period: period,
      products: backendData.produtos?.map((prod: ProductBreakdownApi) => ({
        name: prod.nome,
        tagName: prod.tagType,
        revenue: prod.receita,
        cost: prod.custo,
        profit: prod.lucro,
        quantity: prod.quantidade,
        orders: prod.pedidos,
        profitMarginPercent: prod.margemLucro,
        tagColor: "#ffc94d"
      })) || []
    };
  } catch (error) {
    console.warn("[Dashboard] Endpoint de produtos não encontrado", error);
    return {
      period: period,
      products: []
    };
  }
}