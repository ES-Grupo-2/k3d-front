export type UniqueIdentifier = string | number;
export type KanbanColumnNames = "TODO" | "DOING" | "DONE";
export type PaymentStatus = "UNPAID" | "HALFPAID" | "FULLPAID";
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "PIX";

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
