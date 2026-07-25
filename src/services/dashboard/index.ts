// Serviço de acesso aos dashboards no backend. Busca os dados agregados
// (operacional e financeiro) no servidor, autenticando com o token da sessão.
// É o único ponto que fala com os endpoints /dashboard/* da API.
// Author: lukasnascimento1
import type {
  CategoryRevenueData,
  DailyPoint,
  DailyRevenueData,
  FinancialDashboardData,
  OperationalDashboardData,
  Period,
} from "@/schemas/dashboard/dashboard";
import { authHttp } from "@/services/auth/http";
import type {
  DailyRevenueApiData,
  OperationalDashboardApiData,
  OperationalTagsApiData,
  FinancialDashboardApiData } from "@/types/dashboard";

const periodToPeriodo: Record<Period, string> = {
  WEEKLY: "SEMANAL",
  MONTHLY: "MENSAL",
  SEMIANNUAL: "SEMESTRAL",
};

// Endpoint da série diária (branch 47 do backend). É GERENTE-only — no dashboard
// operacional, usuários OPERACIONAL recebem 403 e o gráfico degrada para vazio.
const DAILY_REVENUE_PATH = "/dashboard/financeiro/receita-diaria";

// Soma 1 dia a uma data "YYYY-MM-DD" em UTC (evita deslocamento por timezone).
function addOneDay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

// O backend só retorna dias que têm pedidos. Preenche os dias faltantes do range
// [dataInicio, dataFim] com zero, para a série de linha ficar contínua.
function fillDailyGaps(
  startIso: string,
  endIso: string,
  points: DailyPoint[],
): DailyPoint[] {
  const start = startIso?.slice(0, 10);
  const end = endIso?.slice(0, 10);

  // Sem range válido: devolve os pontos como vieram, ordenados por data.
  if (!start || !end || start.length !== 10 || end.length !== 10 || start > end) {
    return [...points].sort((a, b) => a.date.localeCompare(b.date));
  }

  const byDate = new Map(points.map((p) => [p.date, p]));
  const result: DailyPoint[] = [];
  let cursor = start;
  // Trava de segurança (semestral ~180 dias) contra loop por data inválida.
  for (let i = 0; i < 400 && cursor <= end; i++) {
    result.push(byDate.get(cursor) ?? { date: cursor, revenue: 0, orders: 0 });
    cursor = addOneDay(cursor);
  }
  return result;
}

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

// Monta a receita por categoria do período. O backend não expõe esse recorte
// pronto, mas os endpoints aceitam ?tagType: o operacional diz quais categorias
// tiveram pedidos e o financeiro devolve a receita de cada uma (1 + N chamadas,
// as N em paralelo). Requer perfil Gerente por causa do endpoint financeiro.
export async function getCategoryRevenue(
  period: Period,
  token: string,
): Promise<CategoryRevenueData> {
  const periodo = periodToPeriodo[period];

  try {
    const operational = await authHttp<OperationalDashboardApiData>(
      `/dashboard/operacional?periodo=${periodo}`,
      { token },
    );

    const tagTypes = (operational.tags ?? [])
      .map((tag) => tag.tagType)
      .filter(Boolean);

    const categories = await Promise.all(
      tagTypes.map(async (tagType) => {
        const financial = await authHttp<FinancialDashboardApiData>(
          `/dashboard/financeiro?periodo=${periodo}&tagType=${encodeURIComponent(tagType)}`,
          { token },
        );
        return { name: tagType, revenue: financial.receitaTotal ?? 0 };
      }),
    );

    return {
      period,
      // Categorias sem receita só ocupariam a legenda: a barra teria largura zero.
      categories: categories
        .filter((category) => category.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue),
    };
  } catch (error) {
    console.warn("[Dashboard] Falha ao montar a receita por categoria", error);
    return { period, categories: [] };
  }
}

// Busca a série diária (receita e nº de pedidos por dia) do período. Um único
// endpoint alimenta os dois gráficos: o operacional usa `orders`, o financeiro
// usa `revenue`. Degrada para vazio se o endpoint ainda não existir ou 403.
export async function getDailyRevenue(
  period: Period,
  token: string,
): Promise<DailyRevenueData> {
  try {
    const backendData = await authHttp<DailyRevenueApiData>(
      `${DAILY_REVENUE_PATH}?periodo=${periodToPeriodo[period]}`,
      { token },
    );
    const points = (backendData.dias ?? []).map((d) => ({
      date: d.data,
      revenue: d.receitaTotal,
      orders: d.totalPedidos,
    }));
    return {
      period,
      days: fillDailyGaps(backendData.dataInicio, backendData.dataFim, points),
    };
  } catch (error) {
    console.warn("[Dashboard] Endpoint de receita diária indisponível", error);
    return { period, days: [] };
  }
}