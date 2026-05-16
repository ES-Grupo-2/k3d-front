/**
 * @file Utilitários de formatação e listas de opções dos enums do domínio.
 * Centraliza funções puras de apresentação reutilizadas em várias páginas.
 * @author lukasnascimento1
 */

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
 * Transforma um enum em SCREAMING_SNAKE_CASE em texto legível.
 * Substitui underscores por espaços e aplica title-case.
 * Ex.: `"PENDING_PRINT"` → `"Pending Print"`.
 *
 * **Onde é usada:** exibição de `OrderStatus` e `PaymentMethod` nos cards do
 * Kanban e nos selects do `OrderForm`.
 *
 * @param s - chave do enum
 * @returns texto humanizado
 */
export function humanizeEnum(s: string): string {
  return s.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
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
