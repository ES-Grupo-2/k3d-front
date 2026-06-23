export type UniqueIdentifier = string | number;
export type KanbanColumnNames = 'A_FAZER' | 'FAZENDO' | 'FINALIZADO'; 
export type PaymentStatus = "UNPAID" | "HALFPAID" | "FULLPAID";
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "PIX";

// export interface Order {
//   id: string;
//   column: KanbanColumnNames;
//   title: string;
//   quantity: number;
//   price: number;
//   status: PaymentStatus;
//   paymentMethod: PaymentMethod;

//   client: {
//     id: string;
//     name: string;
//   };

//   tag: {
//     name: string;
//     color: string;
//   };
// }

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

export interface Order {
  id: string;
  title: string;
  clientId: string;
  tagId?: string;
  totalPrice: number;
  amountPaid?: number;
  cost?: number;
  quantity: number;
  PaymentMethod: string;
  fileUrl?: string;
  link?: string;
  machines?: string;
  client?: Client; // A rota GET /orders/:id traz client e tag preenchidos
  tag?: Tag;
  status: KanbanColumnNames; 
}

export interface KanbanResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}