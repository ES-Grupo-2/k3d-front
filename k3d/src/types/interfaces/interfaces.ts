// Podem ser movidas para dentro de feature/kanban/..

// O identificador pode ser outro (como UUID), a depender de como lidemos com a modelagem
export type UniqueIdentifier = string | number;

// Para o caso de podermos adicionar novas colunas, conversar com o time do BackEnd sobre
// maneiras de comunicarmos isso via API
export type KanbanColumn = "TODO" | "DOING" | "DONE";

export type OrderStatus = "PENDING" | "IN_SEPARATION" | "HALFPAID" | "FULLPAID";
export type PaymentMethod = "CREDIT_CARD" | "PIX" | "BANK_SLIP";


// Pode ser substituída por Card. Verificar Modelagem para outras características
export interface KanbanTask {
  id: UniqueIdentifier;
  columnId: UniqueIdentifier;
  title: string;
  description?: string;
  clientName: string;
  value: number;
  date: string; // formato ISO 8601 (YYYY-MM-DD) ou outro  
  tags?: string[];
}

export interface Order {
  id: string;
  column: KanbanColumn;
  title: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  
  client: {
    id: string; // Geralmente o cliente tem um ID
    name: string;
  };
  
  tag: {
    name: string;
    color: string; // Ex: "#FF0000" ou um nome de classe do Tailwind
  };
}