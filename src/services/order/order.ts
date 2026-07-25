"use server"

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { API_URL } from "../auth/config";
import { ClientApi, CreateClientDTO } from "@/types/order";
import { requireAuth } from "../auth/session";

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