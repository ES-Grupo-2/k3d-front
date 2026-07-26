/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import { Period } from "@/schemas/dashboard/dashboard";

export type OperationalDashboardApiData = {
  period: Period;
  totalPedidos: number;
  tags: OperationalTagsApiData[];
}

export type OperationalTagsApiData = {
    tagName: string;
    tagType: string;
    color: string;
    quantidade: number;
}

export type FinancialDashboardApiData = {
  period: Period;
  receitaTotal: number;
  custoTotal: number;
  lucroTotal: number;
  ticketMedio: number;
  totalPedidos: number;
}

// Série diária (formato exato enviado pelo backend). Cada dia traz a receita e
// o nº de pedidos daquele dia.
export type DailyRevenuePointApi = {
  data: string; // YYYY-MM-DD
  receitaTotal: number;
  totalPedidos: number;
}

export type DailyRevenueApiData = {
  periodo: string;
  dataInicio: string;
  dataFim: string;
  dias: DailyRevenuePointApi[];
}