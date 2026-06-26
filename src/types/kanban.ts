export type UniqueIdentifier = string | number;
export type KanbanTaskStatus = 'PENDENTE' | 'FAZENDO' | 'FINALIZADO'; 
export type PaymentStatus = "UNPAID" | "HALFPAID" | "FULLPAID";
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "PIX";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Tag {
  id: string;
  type: string;
  color?: string;
}

export interface Order {
  id: number; 
  title: string;
  section: KanbanTaskStatus;
  status: string;
  price: number;
  amount_paid: number;
  cost: number | null;
  quantity: number;          
  payment_method: string | null; 
  archive?: string;
  client: {                  
    id: number;
    name: string;
    phone: string;
    email: string | null;
  };
  tag: {                     
    id: number;
    type: string;
    color?: string; 
  };
}

export interface KanbanResponse {
  taskStatus: string;
  tasks: Order[];
};