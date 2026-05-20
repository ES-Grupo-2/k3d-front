export function currency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Alterar algumas dessas tags
// SINCRONIZAR COM INTERFACE DE ORDERS
const enumTranslationsMap: Record<string, string> = {
  PENDING: 'Pendente',
  IN_SEPARATION: 'Em separação', 
  SENT: 'Enviado',
  HALFPAID: 'Meio pago',
  FULLPAID: 'Pago',
  
  CREDIT_CARD: 'Cartão de Crédito',
  PIX: 'Pix',
};

// Adicionar uma verificação para caso um Enum não exista?
export function humanizeEnum(value: string): string {
  return enumTranslationsMap[value] || value;
}