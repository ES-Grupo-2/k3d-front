/**
 * @file Tipos TypeScript compartilhados entre o frontend e os contratos da API
 * REST. Reflete fielmente as entidades expostas pelo backend (User, Client,
 * Tag, Order, etc.), os enums de domínio (KanbanColumn, OrderStatus,
 * PaymentMethod, Role) e os formatos de resposta dos dashboards e da calculadora.
 *
 * **Onde é usado:** importado em praticamente toda página, formulário e hook
 * que consome o backend, garantindo type-safety nas requisições.
 * @author lukasnascimento1
 */

/** Perfis de acesso definidos no backend (RBAC). */
export type Role = "MANAGER" | "OPERATOR";

/** Colunas do quadro Kanban — refletem o enum `KanbanColumn` do Prisma. */
export type KanbanColumn = "TODO" | "DOING" | "DONE";

/** Estados possíveis de um pedido — refletem o enum `OrderStatus` do Prisma. */
export type OrderStatus =
  | "PENDING_PRINT"
  | "PRINTING"
  | "COMPLETED"
  | "PARTIAL_PAYMENT"
  | "PAID";

/** Formas de pagamento — refletem o enum `PaymentMethod` do Prisma. */
export type PaymentMethod =
  | "CASH"
  | "PIX"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BOLETO"
  | "OTHER";

/** Usuário autenticado retornado por `POST /auth/login` e `GET /auth/me`. */
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active?: boolean;
};

/** Cliente cadastrado (entidade `Client` do backend). */
export type Client = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
};

/** Categoria/tag de pedido (entidade `Tag` do backend). */
export type Tag = {
  id: string;
  name: string;
  color: string;
};

/**
 * Pedido completo com relações expandidas (cliente, tag, criador).
 * Retornado por `GET /orders` e `GET /orders/:id`.
 */
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

/** Resposta de `GET /dashboard/operational` — agregação de pedidos por categoria. */
export type OperationalDashboardData = {
  period: string;
  totalOrders: number;
  byCategory: { tagId: string; name: string; color: string; total: number }[];
};

/** Resposta de `GET /dashboard/financial` — indicadores financeiros do período. */
export type FinancialDashboardData = {
  period: string;
  revenue: number;
  cost: number;
  profit: number;
  averageTicket: number;
  totalOrders: number;
};

/** Métricas agregadas de um único produto (agrupado por título do pedido). */
export type ProductBreakdownItem = {
  name: string;
  tagName: string;
  tagColor: string;
  revenue: number;
  cost: number;
  profit: number;
  quantity: number;
  orders: number;
  profitMarginPercent: number;
};

/** Resposta de `GET /dashboard/financial/products` — financeiro detalhado por produto. */
export type ProductsBreakdownData = {
  period: string;
  products: ProductBreakdownItem[];
};

/** Resultado de `POST /calculator/calculate` — breakdown de custo e preço sugerido. */
export type CalculationResult = {
  filamentCost: number;
  energyCost: number;
  depreciationCost: number;
  totalCost: number;
  profitMarginPercent: number;
  profit: number;
  suggestedPrice: number;
};
