/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
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

export const enumPayingMethodMap: Record<string, string> = {
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  PIX: "Pix",
  CASH: "Dinheiro",
  "None": "Nenhum", // Fallback that should never be used!
};

const enumSectionMap: Record<string, string> = {
  PENDENTE: "Pendente",
  FAZENDO: "Fazendo",
  FINALIZADO: "Finalizado",
};

const enumPayingStatusMap: Record<string, string> = {
  UNPAID: "Não pago",
  HALFPAID: "Meio pago",
  FULLPAID: "Pago",
};

export function humanizeSection(value: string): string {
  if (!(value in enumSectionMap)) {
    console.warn(`Invalid Enum! Value: "${value}" not found.`);
  }
  return enumSectionMap[value] || value;
}

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
