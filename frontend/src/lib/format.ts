export function currency(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

export function humanizeEnum(s: string): string {
  return s.replaceAll("_", " ").toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

export const STATUS_OPTIONS = [
  "PENDING_PRINT",
  "PRINTING",
  "COMPLETED",
  "PARTIAL_PAYMENT",
  "PAID",
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  "CASH",
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BOLETO",
  "OTHER",
] as const;
