import { API_URL } from "@/services/auth/config";
import { GetOrdersFilters, PaginatedOrders } from "@/types/order";
import { requireAuth } from "../auth/session";

export async function queryOrders(
  filters: GetOrdersFilters,
): Promise<PaginatedOrders> {
  const searchParams = new URLSearchParams();
  const sessionToken = await requireAuth().then(session => session.token);
  if (!sessionToken) throw new Error("Token de autenticação não encontrado.");

  if (filters.queryInput) searchParams.append("search", filters.queryInput);
  if (filters.status) searchParams.append("status", filters.status);
  if (filters.payment) searchParams.append("paymentMethod", filters.payment);
  if (filters.page) searchParams.append("page", filters.page);

  const queryString = searchParams.toString();
const endpoint = `${API_URL}/orders${queryString ? `?${queryString}` : ""}`;

  return fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  }).then(async (res) => {
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Fetch Error] Endpoint: /orders | Status: ${res.status} | Body:`, errorText);
      throw new Error(`Erro ${res.status} ao buscar o histórico de pedidos`);
    }
    return res.json() as Promise<PaginatedOrders>;
  });
}