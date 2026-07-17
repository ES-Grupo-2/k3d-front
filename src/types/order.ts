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

export type sectionNames = "PENDENTE" | "FAZENDO" | "CONCLUIDO";
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
  
  client: ApiClient;
  clientId: number;
  
  tag: ApiTag;
  tagType: string;
  
  created_at: string;
  updated_at: string;
}

export interface ApiClient {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface ApiTag {
  id: number;
  type: string;
}

