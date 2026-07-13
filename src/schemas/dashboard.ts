// Contratos dos dashboards (operacional e financeiro) expostos pelo backend.
// Centraliza o enum de período, os rótulos em pt-BR e os formatos de resposta,
// garantindo type-safety entre o serviço, as páginas e os componentes de gráfico.
// Author: lukasnascimento1
import { z } from "zod";

export const periodSchema = z.enum(["WEEKLY", "MONTHLY", "SEMIANNUAL"]);

export type Period = z.infer<typeof periodSchema>;

// Rótulos em pt-BR para os valores de período usados pelo backend (em inglês).
export const PERIOD_LABELS: Record<Period, string> = {
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  SEMIANNUAL: "Semestral",
};

export const PERIODS = periodSchema.options;

// Normaliza o valor cru vindo da URL (?period=) para um Period válido.
export function parsePeriod(value: unknown): Period {
  const result = periodSchema.safeParse(value);
  return result.success ? result.data : "MONTHLY";
}

// Resposta de GET /dashboard/operational — agregação de pedidos por categoria.
export interface OperationalDashboardData {
  period: Period;
  totalOrders: number;
  byCategory: {
    tagId: string;
    name: string;
    color: string;
    total: number;
  }[];
}

// Resposta de GET /dashboard/financial — indicadores financeiros do período.
export interface FinancialDashboardData {
  period: Period;
  revenue: number;
  cost: number;
  profit: number;
  averageTicket: number;
  totalOrders: number;
}

// Um produto agregado no breakdown por produto.
export interface ProductBreakdown {
  name: string;
  tagName: string;
  tagColor: string;
  revenue: number;
  cost: number;
  profit: number;
  quantity: number;
  orders: number;
  profitMarginPercent: number;
}

// Resposta de GET /dashboard/financial/products — indicadores por produto.
export interface ProductsBreakdownData {
  period: Period;
  products: ProductBreakdown[];
}
