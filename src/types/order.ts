export interface CreateOrderDTO {
  title: string;
  client_id: number;
  tagType: string;
  price: number;
  amount_paid: number;
  quantity: number;
  
  cost?: number;
  payment_method?: string;
  archive?: string;
  section?: "PENDENTE" | "FAZENDO" | "FINALIZADO";
  status?: string;
}

/**
 * Interface that has the client data (if it's a new one, that's why its optional) and the file that will be sent to the upload endpoint
 */
export interface OrderFormData extends Omit<CreateOrderDTO, 'clientId'> {
  clientId?: string; 
  newClientName?: string;
  newClientPhone?: string;
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

export interface ClientApi {
  data: Client[];
  meta: {
    currentPage?: number,
    itemCount?: number,
    pageSize?: number,
    totalItems?: number,
    totalPages?: number
  };
}