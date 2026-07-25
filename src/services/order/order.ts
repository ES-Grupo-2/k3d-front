"use server"

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { API_URL } from "../auth/config";
import { ClientApi, CreateClientDTO, OrderFormData } from "@/types/order";
import { requireAuth } from "../auth/session";
import { createKanbanOrder } from "../kanban/kanban";

export async function createClient(data: CreateClientDTO) {
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

export async function getClientById(id: string) {
    const sessionToken = (await requireAuth().then(session => session.token));
    if (!sessionToken) throw new Error("Token de autenticação não encontrado.");

    const response = await fetch(`${API_URL}/clients/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Cliente não encontrado.");
  }

  return response.json();
}

/**
 * Generates a pre-signed URL for uploading a file to the storage
 * @param taskId 
 * @param filename The file for which to generate a pre-signed URL
 * @returns {url: string, expiresIn: number}
 */
// export async function getPresignedUrl(taskId: string, filename: string) {
//     const sessionToken = (await requireAuth().then(session => session.token));
//     if (!sessionToken) throw new Error("Token de autenticação não encontrado.");

//   const params = new URLSearchParams({
//     taskId,
//     filename,
//   });

//   const response = await fetch(`${API_URL}/upload/presigned-url?${params.toString()}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${sessionToken}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Falha ao gerar URL de upload.");
//   }

//   return response.json();
// }

// export async function uploadFileToMinIO(presignedUrl: string, file: File) {
//   const response = await fetch(presignedUrl, {
//     method: "PUT",
//     headers: {
//       "Content-Type": file.type || "application/octet-stream", 
//     },
//     body: file, 
//   });

//   if (!response.ok) {
//     throw new Error("Falha ao enviar arquivo para o storage.");
//   }

//   return true;
// }

export async function uploadOrderFile(file: File) {
  const session = await requireAuth();
  if (!session?.token) throw new Error("Acesso não autorizado");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Falha ao fazer o upload do arquivo.");
  }

  return response.json() as Promise<{ url: string; fileName: string; mimeType: string }>;
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
    finalClientName = (formData as any).clientNameForUI || "Cliente"; 
  }

  let finalArchiveName = formData.archive || ""; 
  if (formData.file && formData.file.length > 0) {
    const fileToUpload = formData.file[0];
    const uploadResponse = await uploadOrderFile(fileToUpload) as any;
    const extractedFileName = uploadResponse.fileName || uploadResponse.data?.fileName;
    if (!extractedFileName) throw new Error("Upload concluído, mas o backend não devolveu o fileName!");
    finalArchiveName = extractedFileName; 
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
    archive: finalArchiveName, 
  };

  const newOrder = await createKanbanOrder(initialPayload);
  
  // 4. HIDRATAÇÃO DO RETORNO PARA O FRONTEND
  newOrder.tag = { type: formData.tagType }; 
  newOrder.client = { name: finalClientName };

  return newOrder;
}