import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const enumPayingMethodMap: Record<string, string> = {
  CREDIT_CARD: "Cartão de Crédito",
  PIX: "Pix",
  DEBIT_CARD: "Cartão de Débito",
  CASH: "Dinheiro",
  "None": "Nenhum",
};

const enumPayingStatusMap: Record<string, string> = {
  UNPAID: "Não pago",
  HALFPAID: "Meio pago",
  FULLPAID: "Pago",
};

export function humanizePayMethod(value: string): string {
  if (!(value in enumPayingMethodMap)) {
    console.warn(`Invalid Enum! Value: "${value}" not found.`);
  }
  return enumPayingMethodMap[value] || value;
}

export function humanizePayStatus(amountPaid: number, fullPrice: number): string {
  const value = amountPaid === 0
    ? "UNPAID"
    : amountPaid === fullPrice
      ? "FULLPAID"
      : "HALFPAID";

  if (!(value in enumPayingStatusMap)) {
    console.warn(`Invalid Enum! Value: "${value}" not found.`);
  }
  return enumPayingStatusMap[value] || value;
}
