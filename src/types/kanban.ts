
export type UniqueIdentifier = string | number;
export type KanbanColumnNames = "TODO" | "DOING" | "DONE";
export type PaymentStatus = "UNPAID" | "HALFPAID" | "FULLPAID";
export type PaymentMethod = "CREDIT_CARD" | "PIX" | "BANK_SLIP";

export interface KanbanTask {
  id: UniqueIdentifier;
  columnId: UniqueIdentifier;
  title: string;
  description?: string;
  clientName: string;
  value: number;
  date: string;  
  tags?: string[];
}

export interface Order {
  id: string;
  column: KanbanColumnNames;
  title: string;
  quantity: number;
  price: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  
  client: {
    id: string;
    name: string;
  };
  
  tag: {
    name: string;
    color: string;
  };
}