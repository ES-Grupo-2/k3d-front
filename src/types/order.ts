export interface CreateOrderDTO {
  title: string;
  clientId: number;
  tagId?: number;
  price: number; // ou 'TotalPrice', dependendo do schema exato do Zod
  amount_paid?: number; // ou 'AmountPaid'
  cost?: number;
  quantity: number;
  payment_method: string; // ou ''
  fileUrl?: string;
  link?: string;
  machines?: string[];
}

// Estendemos o payload para acomodar os dados do NOVO cliente que a API vai precisar
export interface OrderFormData extends Omit<CreateOrderDTO, 'clientId'> {
  clientId?: string; // Opcional no form, pois pode ser novo
  newClientName?: string;
  newClientPhone?: string;
  // O arquivo real que será enviado para o endpoint de upload
  file: FileList | null; 
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface CreateClientDTO {
  name: string;
  phone: string;
  email?: string;
}

export interface Tag {
  id: string;
  type: string;
  color?: string;
}