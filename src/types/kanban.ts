export type UniqueIdentifier = string | number;
// export type KanbanColumnNames = 'PENDENTE' | 'FAZENDO' | 'FINALIZADO'; 
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
  label: string;
  color?: string;
}

// export interface Order {
//   id: string;
//   title: string;
//   clientId: string;
//   tagId?: string;
//   totalPrice: number;
//   amountPaid?: number;
//   cost?: number;
//   quantity: number;
//   PaymentMethod: string;
//   fileUrl?: string;
//   link?: string;
//   machines?: string;
//   client?: Client; // A rota GET /orders/:id traz client e tag preenchidos
//   tag?: Tag;
//   status: KanbanColumnNames; 
// }


export interface Order {
  id: string;
  title: string;
  section: KanbanTaskStatus;
  status: string; 
  price: number;
  amount_paid?: number;
  cost?: number;
  archive?: string;
}

export interface KanbanResponse {
  taskStatus: string;
  tasks: Order[];
};