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

const enumTranslationsMap: Record<string, string> = {
  UNPAID: "Não pago",
  HALFPAID: "Meio pago",
  FULLPAID: "Pago",

  NAO_PAGO: "Não pago",
  PAGO_PARCIAL: "Meio pago",
  PAGO: "Pago",

  PENDENTE: "Pendente",
  FAZENDO: "Fazendo",
  CONCLUIDO: "Concluído",

  CREDIT_CARD: "Cartão de Crédito",
  PIX: "Pix",
  DEBIT_CARD: "Cartão de Débito",
  CASH: "Dinheiro",

  TODO: "A Fazer",
  DOING: "Fazendo",
  DONE: "Concluído",

  "None": "Nenhum",
};

export function humanizeEnum(value: string): string {
  if (!(value in enumTranslationsMap)) {
    console.warn(`Invalid Enum! Value: "${value}" not found.`);
  }
  return enumTranslationsMap[value] || value;
}
