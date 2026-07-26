"use server"

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { API_URL } from "../auth/config";
import { ClientApi, CreateClientDTO, OrderFormData } from "@/types/order";
import { requireAuth } from "../auth/session";
import { createKanbanOrder } from "../kanban/kanban";

async function createClient(data: CreateClientDTO) {
    const sessionToken = (await requireAuth().then(session => session.token));
    if (!sessionToken) throw new Error("Token de autenticação não encontrado.");

  const response = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || "Falha ao criar cliente.");
  }

  return response.json(); 
}

export async function getClients(): Promise<ClientApi> {
  const session = await requireAuth();
  const token = session?.token;
  
  if (!token) throw new Error("Acesso não autorizado");

  const response = await fetch(`${API_URL}/clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao buscar a lista de clientes.");
  }
  
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function downloadOrderFile(fileName: string): Promise<Blob> {
  const session = await requireAuth();
  const token = session?.token;
  
  if (!token) throw new Error("Acesso não autorizado");

  const response = await fetch(`${API_URL}/files/${fileName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Falha ao baixar o arquivo.");
  }

  return response.blob();
}
export async function uploadOrderFile(payload: FormData) {
  const session = await requireAuth();
  if (!session?.token) throw new Error("Acesso não autorizado");

  const file = payload.get("file");
  if (!file) throw new Error("Arquivo não encontrado.");

  const externalFormData = new FormData();
  externalFormData.append("file", file);

  const response = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    body: externalFormData,
  });

  if (!response.ok) {
    const errText = await response.text(); 
    console.error("Erro do backend de arquivos:", errText);
    throw new Error("Falha ao fazer o upload do arquivo.");
  }

  return response.json() as Promise<UploadResponse>;
}

export async function orchestrateOrderCreation(formData: OrderFormData) {
  let finalClientId = formData.clientId;
  let finalClientName = ""; 

  if (!finalClientId && formData.newClientName) {
    const clientResponse = await createClient({ 
      name: formData.newClientName, 
      phone: formData.newClientPhone || "" 
    });
    if (!clientResponse || !clientResponse.id) throw new Error("Falha ao criar cliente.");
    finalClientId = clientResponse.id;
    finalClientName = formData.newClientName; 
  } else {
    finalClientName = formData.newClientName || "Cliente"; 
  }

  const initialPayload = {
    title: formData.title,
    client_id: Number(finalClientId), 
    tagType: formData.tagType,          
    price: formData.price,
    amount_paid: formData.amount_paid,
    cost: formData.cost,
    quantity: formData.quantity,
    payment_method: formData.payment_method,
    archive: formData.archive || "", 
  };

  const newOrder = await createKanbanOrder(initialPayload);
  
  newOrder.tag = { type: formData.tagType }; 
  newOrder.client = { name: finalClientName };

  return newOrder;
}

export type UploadResponse = {
    url: string,
    fileName: string,
    mimeType?: string,
  };

export type UploadFileApiResponse = {
  fileName?: string;
  data?: {
    fileName?: string;
  };
};