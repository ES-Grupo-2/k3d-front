import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

const enumTranslationsMap: Record<string, string> = {
  UNPAID: 'Não pago',
  HALFPAID: 'Meio pago',
  FULLPAID: 'Pago',
  
  CREDIT_CARD: 'Cartão de Crédito',
  PIX: 'Pix',
  DEBIT_CARD: 'Cartão de Débito',
  CASH: 'Dinheiro',
};

export function humanizeEnum(value: string): string {
  if(!(value in enumTranslationsMap)) {
    console.log(`Enum value "${value}" not found.`);  
  }
  return enumTranslationsMap[value] || value;
}
