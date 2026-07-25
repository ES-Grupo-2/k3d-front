"use server"

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { KanbanResponse, KanbanTaskStatus } from "@/types/kanban";
import { API_URL } from "@/services/auth/config";
import { requireAuth } from "../auth/session";
import { CreateOrderDTO, UpdateOrderPayload } from "@/types/order";

export async function fetchKanbanBoard(token: string) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const sections = ["PENDENTE", "FAZENDO", "FINALIZADO"];

  const requests = sections.map((section) => {
    return fetch(`${API_URL}/kanban/sections/${section}`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`[Fetch Error] Section: ${section} | Status: ${res.status} | Body:`, errorText);
          throw new Error(`Erro ${res.status} na seção ${section}`);
        }
        return res.json() as Promise<KanbanResponse>;
      });
  });

  const [todoRes, doingRes, doneRes] = await Promise.all(requests);

  return {
    PENDENTE: todoRes.tasks,
    FAZENDO: doingRes.tasks,
    FINALIZADO: doneRes.tasks,
  };
}

export async function moveKanbanOrder(orderId: number, targetSection: KanbanTaskStatus) {
  const sessionToken = await requireAuth().then(session => session.token);
  if (!sessionToken) throw new Error("Token de autenticação não encontrado.");

  const response = await fetch(`${API_URL}/orders/${orderId}/move`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ destinationSection: targetSection }),
  });

  if (!response.ok) {
    throw new Error("Falha ao mover o pedido no servidor.\n [ERROR]: " + response.statusText + " " + response.status);
  }
  return response.json();
}

export async function createKanbanOrder(data: CreateOrderDTO) {
  const session = await requireAuth();
  const token = session?.token;

  if (!token) throw new Error("Acesso não autorizado");

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Falha ao criar o pedido no servidor.");
  }

  return response.json(); 
}

// Atualiza um pedido existente (edição completa, menos o cliente).
// Usa PUT /orders/:id — o backend trata campos ausentes como update parcial.
export async function updateKanbanOrder(orderId: number, data: UpdateOrderPayload) {
  const session = await requireAuth();
  const token = session?.token;
  if (!token) throw new Error("Acesso não autorizado");

  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Falha ao atualizar o pedido.");
  }

  return response.json();
}

export async function deleteKanbanOrder(orderId: number) {
  const session = await requireAuth();
  const token = session?.token;
  if (!token) throw new Error("Acesso não autorizado");

  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Falha ao deletar o pedido.");
  }
  
  return true;
}