// Serviço de acesso aos dashboards no backend. Busca os dados agregados
// (operacional e financeiro) no servidor, autenticando com o token da sessão.
// É o único ponto que fala com os endpoints /dashboard/* da API.
//
// Cache: cada função é envolvida por `unstable_cache` com janela de 60s
// (`revalidate`). Como o backend só expõe totais agregados por período e as
// navegações repetiam a consulta a cada visita, o cache serve o resultado
// guardado dentro da janela sem ir ao backend, reduzindo latência e carga.
// `period` e `token` entram como argumentos (logo, fazem parte da chave): o
// cache fica por usuário e a revalidação em segundo plano sempre usa o token
// fresco do request atual. As `tags` permitem invalidação sob demanda futura
// (revalidateTag) quando um pedido for criado/editado.
// Author: lukasnascimento1
import { unstable_cache } from "next/cache";

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

// Janela de cache dos dashboards, em segundos.
const DASHBOARD_REVALIDATE = 60;

// Tags de cache para invalidação sob demanda (revalidateTag) no futuro.
export const DASHBOARD_CACHE_TAGS = {
  operational: "dashboard-operational",
  financial: "dashboard-financial",
  products: "dashboard-products",
} as const;

// Busca a agregação operacional (pedidos por categoria) do período informado.
export async function getOperationalDashboard(
  period: Period,
  token: string,
): Promise<OperationalDashboardData> {
  const load = unstable_cache(
    async (p: Period, t: string): Promise<OperationalDashboardData> => {
      const backendData = await authHttp<OperationalDashboardApiData>(
        `/dashboard/operacional?periodo=${periodToPeriodo[p]}`,
        { token: t },
      );
      return {
        period: p,
        totalOrders: backendData.totalPedidos,
        byCategory: backendData.tags.map((tag: OperationalTagsApiData, idx) => ({
          tagId: String(idx + 1),
          name: tag.tagType,
          color: "#ffc94d", // Placeholder color since backend doesn't provide it
          total: tag.quantidade,
        })),
      };
    },
    [DASHBOARD_CACHE_TAGS.operational],
    { revalidate: DASHBOARD_REVALIDATE, tags: [DASHBOARD_CACHE_TAGS.operational] },
  );

  return load(period, token);
}

// Busca os indicadores financeiros (receita, custo, lucro, ticket) do período.
export async function getFinancialDashboard(
  period: Period,
  token: string,
): Promise<FinancialDashboardData> {
  const load = unstable_cache(
    async (p: Period, t: string): Promise<FinancialDashboardData> => {
      const backendData = await authHttp<FinancialDashboardApiData>(
        `/dashboard/financeiro?periodo=${periodToPeriodo[p]}`,
        { token: t },
      );
      return {
        period: p,
        revenue: backendData.receitaTotal,
        cost: backendData.custoTotal,
        profit: backendData.lucroTotal,
        averageTicket: backendData.ticketMedio,
        totalOrders: backendData.totalPedidos,
      };
    },
    [DASHBOARD_CACHE_TAGS.financial],
    { revalidate: DASHBOARD_REVALIDATE, tags: [DASHBOARD_CACHE_TAGS.financial] },
  );

  return load(period, token);
}

// Busca o detalhamento por produto (receita, custo, lucro, margem, quantidade).
// Requer perfil Gerente no backend.
export async function getProductsBreakdown(
  period: Period,
  token: string,
): Promise<ProductsBreakdownData> {
  const load = unstable_cache(
    async (p: Period, t: string): Promise<ProductsBreakdownData> => {
      const backendData = await authHttp<ProductsBreakdownApiData>(
        `/dashboard/financeiro/produtos?periodo=${periodToPeriodo[p]}`,
        { token: t },
      );
      return {
        period: p,
        products:
          backendData.produtos?.map((prod: ProductBreakdownApi) => ({
            name: prod.nome,
            tagName: prod.tagType,
            revenue: prod.receita,
            cost: prod.custo,
            profit: prod.lucro,
            quantity: prod.quantidade,
            orders: prod.pedidos,
            profitMarginPercent: prod.margemLucro,
            tagColor: "#ffc94d",
          })) || [],
      };
    },
    [DASHBOARD_CACHE_TAGS.products],
    { revalidate: DASHBOARD_REVALIDATE, tags: [DASHBOARD_CACHE_TAGS.products] },
  );

  // Mantém o fallback silencioso: erro (ex.: endpoint ausente) não é cacheado
  // pelo unstable_cache, então tratamos fora do escopo de cache.
  try {
    return await load(period, token);
  } catch (error) {
    console.warn("[Dashboard] Endpoint de produtos não encontrado", error);
    return {
      period,
      products: [],
    };
  }
}
