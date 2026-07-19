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
export interface GetOrdersFilters {
  queryInput?: string;
  section?: string;
  payment?: string;
  page?: string;
}

export interface PaginatedOrders {
  data: ApiOrder[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number; 
    pageSize: number;
  };
}

export type sectionNames = "PENDENTE" | "FAZENDO" | "FINALIZADO";
export type paymentStatus = "NAO_PAGO" | "PAGO_PARCIAL" | "PAGO";

export interface ApiOrder {
  id: number;
  title: string;
  quantity: number;
  price: number;
  amount_paid: number;
  cost: number | null;
  payment_method: string | null;
  
  section: sectionNames;
  status: paymentStatus;
  
  archive: string | null;
  
  client: Client;
  clientId: number;
  
  tag: ApiTag;
  tagType: string;
  
  created_at: string;
  updated_at: string;
}


export interface ApiTag {
  id: number;
  type: string;
}

