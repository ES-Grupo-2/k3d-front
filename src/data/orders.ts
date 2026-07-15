import type {
  KanbanColumnNames,
  Order,
  PaymentMethod,
  PaymentStatus,
} from "@/types/kanban";

// Single source of orders data while there's no backend.
// Centralizes the dataset and the search/filter logic so the Orders screen (and
// later the Kanban) consume the same place — just swap `queryOrders` for a real
// HTTP call once the API exists.

const MOCK_ORDERS: Order[] = [
  {
    id: "1042",
    column: "TODO",
    title: "Manutenção Preventiva Servidor",
    quantity: 1,
    price: 1500.0,
    status: "UNPAID",
    paymentMethod: "PIX",
    client: { id: "c1", name: "Empresa Alpha Ltda" },
    tag: { name: "Infra", color: "#3b82f6" },
  },
  {
    id: "1043",
    column: "DOING",
    title: "Licenças Office 365",
    quantity: 10,
    price: 3500.0,
    status: "HALFPAID",
    paymentMethod: "CREDIT_CARD",
    client: { id: "c2", name: "Escola Beta" },
    tag: { name: "Software", color: "#10b981" },
  },
  {
    id: "1044",
    column: "DONE",
    title: "Roteadores Wi-Fi 6",
    quantity: 3,
    price: 1200.0,
    status: "FULLPAID",
    paymentMethod: "CREDIT_CARD",
    client: { id: "c3", name: "Cafeteria Delta" },
    tag: { name: "Hardware", color: "#f59e0b" },
  },
  {
    id: "1045",
    column: "DONE",
    title: "Cabeamento Estruturado",
    quantity: 1,
    price: 8200.0,
    status: "FULLPAID",
    paymentMethod: "PIX",
    client: { id: "c4", name: "Construtora Épsilon" },
    tag: { name: "Infra", color: "#3b82f6" },
  },
  {
    id: "1046",
    column: "TODO",
    title: "Migração de E-mails",
    quantity: 45,
    price: 2700.0,
    status: "UNPAID",
    paymentMethod: "DEBIT_CARD",
    client: { id: "c5", name: "Clínica Gama" },
    tag: { name: "Software", color: "#10b981" },
  },
  {
    id: "1047",
    column: "DOING",
    title: "Câmeras de Segurança IP",
    quantity: 8,
    price: 5600.0,
    status: "HALFPAID",
    paymentMethod: "CASH",
    client: { id: "c6", name: "Mercado Zeta" },
    tag: { name: "Hardware", color: "#f59e0b" },
  },
  {
    id: "1048",
    column: "DONE",
    title: "Backup em Nuvem",
    quantity: 1,
    price: 990.0,
    status: "FULLPAID",
    paymentMethod: "PIX",
    client: { id: "c7", name: "Advocacia Teta" },
    tag: { name: "Cloud", color: "#8b5cf6" },
  },
  {
    id: "1049",
    column: "TODO",
    title: "Notebooks Corporativos",
    quantity: 12,
    price: 48000.0,
    status: "UNPAID",
    paymentMethod: "CREDIT_CARD",
    client: { id: "c8", name: "Indústria Ômega" },
    tag: { name: "Hardware", color: "#f59e0b" },
  },
  {
    id: "1050",
    column: "DOING",
    title: "Firewall Gerenciado",
    quantity: 1,
    price: 3200.0,
    status: "HALFPAID",
    paymentMethod: "PIX",
    client: { id: "c9", name: "Fintech Sigma" },
    tag: { name: "Infra", color: "#3b82f6" },
  },
  {
    id: "1051",
    column: "DONE",
    title: "Treinamento de Equipe",
    quantity: 20,
    price: 4000.0,
    status: "FULLPAID",
    paymentMethod: "DEBIT_CARD",
    client: { id: "c10", name: "Startup Lambda" },
    tag: { name: "Serviço", color: "#ec4899" },
  },
  {
    id: "1052",
    column: "DONE",
    title: "Servidor NAS 24TB",
    quantity: 2,
    price: 15800.0,
    status: "FULLPAID",
    paymentMethod: "PIX",
    client: { id: "c11", name: "Estúdio Kappa" },
    tag: { name: "Hardware", color: "#f59e0b" },
  },
  {
    id: "1053",
    column: "DOING",
    title: "Suporte Mensal TI",
    quantity: 1,
    price: 2500.0,
    status: "UNPAID",
    paymentMethod: "CASH",
    client: { id: "c12", name: "Restaurante Pi" },
    tag: { name: "Serviço", color: "#ec4899" },
  },
];

export interface OrderFilters {
  q?: string;
  column?: KanbanColumnNames;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
}

// Normalizes text for accent-insensitive and case-insensitive search.
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

// Simulates the backend search: applies the text query and the given filters.
// Async on purpose, so swapping it for a real HTTP call won't require changing
// its consumers.
export async function queryOrders(
  filters: OrderFilters = {},
): Promise<Order[]> {
  const term = filters.q ? normalize(filters.q.trim()) : "";

  return MOCK_ORDERS.filter((order) => {
    const matchesTerm =
      !term ||
      normalize(order.title).includes(term) ||
      normalize(order.client.name).includes(term) ||
      normalize(order.id).includes(term);

    const matchesColumn = !filters.column || order.column === filters.column;
    const matchesPayment =
      !filters.paymentMethod || order.paymentMethod === filters.paymentMethod;
    const matchesStatus = !filters.status || order.status === filters.status;

    return matchesTerm && matchesColumn && matchesPayment && matchesStatus;
  });
}
