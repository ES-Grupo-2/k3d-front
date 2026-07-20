/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import type {
  KanbanTaskStatus,
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
    id: 1042,
    section: "PENDENTE",
    title: "Manutenção Preventiva Servidor",
    quantity: 1,
    price: 1500.0,
    amount_paid: 0,
    cost: 800.0,
    status: "NAO_PAGO",
    payment_method: "PIX",
    client: { 
      id: 1, 
      name: "Empresa Alpha Ltda",
      phone: "(83) 98888-0001",
      email: "contato@alpha.com"
    },
    tag: { id: 101, type: "Infra", color: "#3b82f6" },
  },
  {
    id: 1043,
    section: "FAZENDO",
    title: "Licenças Office 365",
    quantity: 10,
    price: 3500.0,
    amount_paid: 1750.0,
    cost: 2500.0,
    status: "PAGO_PARCIAL",
    payment_method: "CREDIT_CARD",
    client: { 
      id: 2, 
      name: "Escola Beta",
      phone: "(83) 98888-0002",
      email: "diretoria@escolabeta.edu"
    },
    tag: { id: 102, type: "Software", color: "#10b981" },
  },
  {
    id: 1044,
    section: "FINALIZADO",
    title: "Roteadores Wi-Fi 6",
    quantity: 3,
    price: 1200.0,
    amount_paid: 1200.0,
    cost: 750.0,
    status: "PAGO",
    payment_method: "CREDIT_CARD",
    archive: "https://link-comprovante.com/1044",
    client: { 
      id: 3, 
      name: "Cafeteria Delta",
      phone: "(83) 98888-0003",
      email: null
    },
    tag: { id: 103, type: "Hardware", color: "#f59e0b" },
  },
  {
    id: 1045,
    section: "FINALIZADO",
    title: "Cabeamento Estruturado",
    quantity: 1,
    price: 8200.0,
    amount_paid: 8200.0,
    cost: 4100.0,
    status: "PAGO",
    payment_method: "PIX",
    client: { 
      id: 4, 
      name: "Construtora Épsilon",
      phone: "(83) 98888-0004",
      email: "compras@epsilon.com"
    },
    tag: { id: 101, type: "Infra", color: "#3b82f6" },
  },
  {
    id: 1046,
    section: "PENDENTE",
    title: "Migração de E-mails",
    quantity: 45,
    price: 2700.0,
    amount_paid: 0,
    cost: null,
    status: "NAO_PAGO",
    payment_method: "DEBIT_CARD",
    client: { 
      id: 5, 
      name: "Clínica Gama",
      phone: "(83) 98888-0005",
      email: "ti@clinicagama.com"
    },
    tag: { id: 102, type: "Software", color: "#10b981" },
  },
  {
    id: 1047,
    section: "FAZENDO",
    title: "Câmeras de Segurança IP",
    quantity: 8,
    price: 5600.0,
    amount_paid: 2800.0,
    cost: 3200.0,
    status: "PAGO_PARCIAL",
    payment_method: "CASH",
    client: { 
      id: 6, 
      name: "Mercado Zeta",
      phone: "(83) 98888-0006",
      email: null
    },
    tag: { id: 103, type: "Hardware", color: "#f59e0b" },
  },
  {
    id: 1048,
    section: "FINALIZADO",
    title: "Backup em Nuvem",
    quantity: 1,
    price: 990.0,
    amount_paid: 990.0,
    cost: 400.0,
    status: "PAGO",
    payment_method: "PIX",
    client: { 
      id: 7, 
      name: "Advocacia Teta",
      phone: "(83) 98888-0007",
      email: "contato@teta.adv.br"
    },
    tag: { id: 104, type: "Cloud", color: "#8b5cf6" },
  },
  {
    id: 1049,
    section: "PENDENTE",
    title: "Notebooks Corporativos",
    quantity: 12,
    price: 48000.0,
    amount_paid: 0,
    cost: 38000.0,
    status: "NAO_PAGO",
    payment_method: "CREDIT_CARD",
    client: { 
      id: 8, 
      name: "Indústria Ômega",
      phone: "(83) 98888-0008",
      email: "suprimentos@omega.ind.br"
    },
    tag: { id: 103, type: "Hardware", color: "#f59e0b" },
  },
  {
    id: 1050,
    section: "FAZENDO",
    title: "Firewall Gerenciado",
    quantity: 1,
    price: 3200.0,
    amount_paid: 1600.0,
    cost: 1500.0,
    status: "PAGO_PARCIAL",
    payment_method: "PIX",
    client: { 
      id: 9, 
      name: "Fintech Sigma",
      phone: "(83) 98888-0009",
      email: "infra@sigma.com"
    },
    tag: { id: 101, type: "Infra", color: "#3b82f6" },
  },
  {
    id: 1051,
    section: "FINALIZADO",
    title: "Treinamento de Equipe",
    quantity: 20,
    price: 4000.0,
    amount_paid: 4000.0,
    cost: 1000.0,
    status: "PAGO",
    payment_method: "DEBIT_CARD",
    client: { 
      id: 10, 
      name: "Startup Lambda",
      phone: "(83) 98888-0010",
      email: "hello@lambda.io"
    },
    tag: { id: 105, type: "Serviço", color: "#ec4899" },
  },
  {
    id: 1052,
    section: "FINALIZADO",
    title: "Servidor NAS 24TB",
    quantity: 2,
    price: 15800.0,
    amount_paid: 15800.0,
    cost: 11000.0,
    status: "PAGO",
    payment_method: "PIX",
    client: { 
      id: 11, 
      name: "Estúdio Kappa",
      phone: "(83) 98888-0011",
      email: "projetos@kappa.art"
    },
    tag: { id: 103, type: "Hardware", color: "#f59e0b" },
  },
  {
    id: 1053,
    section: "FAZENDO",
    title: "Suporte Mensal TI",
    quantity: 1,
    price: 2500.0,
    amount_paid: 0,
    cost: 500.0,
    status: "NAO_PAGO",
    payment_method: "CASH",
    client: { 
      id: 12, 
      name: "Restaurante Pi",
      phone: "(83) 98888-0012",
      email: null
    },
    tag: { id: 105, type: "Serviço", color: "#ec4899" },
  },
];

export interface OrderFilters {
  q?: string;
  column?: KanbanTaskStatus;
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
      normalize(String(order.id)).includes(term);

    const matchesColumn = !filters.column || order.section === filters.column;
    const matchesPayment =
      !filters.paymentMethod || order.payment_method === filters.paymentMethod;
    const matchesStatus = !filters.status || order.status === filters.status;

    return matchesTerm && matchesColumn && matchesPayment && matchesStatus;
  });
}
