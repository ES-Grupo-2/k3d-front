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

export type ProductBreakdownApi = {
  nome: string;
  tagType: string;
  tagColor: string;
  receita: number;
  custo: number;
  lucro: number;
  quantidade: number;
  pedidos: number;
  margemLucro: number;
}

export type ProductsBreakdownApiData = {
  period: Period;
  produtos: ProductBreakdownApi[];
}