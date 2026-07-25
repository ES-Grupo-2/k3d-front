/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
export type UniqueIdentifier = string | number;
export type KanbanTaskStatus = 'PENDENTE' | 'FAZENDO' | 'FINALIZADO'; 
export type PaymentStatus = "NAO_PAGO" | "PAGO_PARCIAL" | "PAGO";
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "PIX";

export interface Order {
  id: number; 
  title: string;
  section: KanbanTaskStatus;
  status: PaymentStatus;
  price: number;
  amount_paid: number;
  cost: number | null;
  quantity: number;          
  payment_method: PaymentMethod | string | null; 
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
  created_at?: string;
  updated_at?: string;
}

export interface KanbanResponse {
  taskStatus: string;
  tasks: Order[];
};