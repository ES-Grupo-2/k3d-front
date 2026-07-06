export interface CreateOrderDTO {
  title: string;
  clientId: number;
  tagId?: number;
  price: number; 
  amount_paid?: number; 
  cost?: number;
  quantity: number;
  payment_method: string;
  fileUrl?: string;
  link?: string;
  machines?: string[];
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