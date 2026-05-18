/**
 * @file Utilitários de formatação e listas de opções dos enums do domínio.
 * Centraliza funções puras de apresentação reutilizadas em várias páginas.
 *
 * Os mapas `ORDER_STATUS_LABELS` e `PAYMENT_METHOD_LABELS` traduzem os enums
 * (que ficam em inglês no banco/API) para o português exibido na interface.
 * @author lukasnascimento1
 */
import type { OrderStatus, PaymentMethod } from "../api/types";

/**
 * Converte um valor numérico (ou string numérica) para o formato monetário
 * brasileiro (R$). Tolera entrada string vinda direto da API (Prisma Decimal
 * serializa como string).
 *
 * **Onde é usada:** cards do Kanban (`Card` em `Kanban.tsx`), resultado da
 * Calculadora, métricas do Dashboard Financeiro, formulários.
 *
 * @param value - número ou string numérica (ex.: `12.5` ou `"12.50"`)
 * @returns string formatada (ex.: `"R$ 12,50"`)
 */
export function currency(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

/**
 * Mapa de tradução dos status de pedido. Backend usa enums em inglês;
 * a interface exibe em português.
 *
 * **Onde é usado:** cards do Kanban (status do pedido) e selects do
 * `OrderForm`.
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PRINT: "Aguardando impressão",
  PRINTING: "Imprimindo",
  COMPLETED: "Concluído",
  PARTIAL_PAYMENT: "Pagamento parcial",
  PAID: "Pago",
};

/**
 * Mapa de tradução das formas de pagamento. Backend usa enums em inglês;
 * a interface exibe em português.
 *
 * **Onde é usado:** cards do Kanban (forma de pagamento) e selects do
 * `OrderForm`.
 */
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Dinheiro",
  PIX: "PIX",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  BOLETO: "Boleto",
  OTHER: "Outro",
};

/**
 * Retorna o rótulo em português para um status de pedido. Se o valor não
 * estiver no mapa (caso improvável), faz fallback para o próprio valor.
 *
 * @param s - chave do enum `OrderStatus`
 * @returns texto em português
 */
export function orderStatusLabel(s: OrderStatus): string {
  return ORDER_STATUS_LABELS[s] ?? s;
}

/**
 * Retorna o rótulo em português para uma forma de pagamento.
 *
 * @param m - chave do enum `PaymentMethod`
 * @returns texto em português
 */
export function paymentMethodLabel(m: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[m] ?? m;
}

/**
 * Lista canônica dos status de pedido. Espelha o enum `OrderStatus` do backend.
 * Usada para popular o `<select>` de status no `OrderForm`.
 */
export const STATUS_OPTIONS = [
  "PENDING_PRINT",
  "PRINTING",
  "COMPLETED",
  "PARTIAL_PAYMENT",
  "PAID",
] as const;

/**
 * Lista canônica das formas de pagamento. Espelha o enum `PaymentMethod` do backend.
 * Usada para popular o `<select>` de forma de pagamento no `OrderForm`.
 */
export const PAYMENT_METHOD_OPTIONS = [
  "CASH",
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BOLETO",
  "OTHER",
] as const;
