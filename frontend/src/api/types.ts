export type Role = "MANAGER" | "OPERATOR";

export type KanbanColumn = "TODO" | "DOING" | "DONE";

export type OrderStatus =
  | "PENDING_PRINT"
  | "PRINTING"
  | "COMPLETED"
  | "PARTIAL_PAYMENT"
  | "PAID";

export type PaymentMethod =
  | "CASH"
  | "PIX"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BOLETO"
  | "OTHER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active?: boolean;
};

export type Client = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Order = {
  id: string;
  title: string;
  column: KanbanColumn;
  status: OrderStatus;
  position: number;
  fileUrl?: string | null;
  fileName?: string | null;
  price: string | number;
  amountPaid: string | number;
  cost: string | number;
  quantity: number;
  paymentMethod: PaymentMethod;
  notes?: string | null;
  client: Client;
  tag: Tag;
  createdBy: { id: string; name: string };
  createdAt: string;
};

export type OperationalDashboardData = {
  period: string;
  totalOrders: number;
  byCategory: { tagId: string; name: string; color: string; total: number }[];
};

export type FinancialDashboardData = {
  period: string;
  revenue: number;
  cost: number;
  profit: number;
  averageTicket: number;
  totalOrders: number;
};

export type CalculationResult = {
  filamentCost: number;
  energyCost: number;
  depreciationCost: number;
  totalCost: number;
  profitMarginPercent: number;
  profit: number;
  suggestedPrice: number;
};
