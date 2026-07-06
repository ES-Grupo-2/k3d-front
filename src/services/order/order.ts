"use server"
import { API_URL } from "../auth/config";
import { CreateClientDTO } from "@/types/order";
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
export async function getPresignedUrl(taskId: string, filename: string) {
    const sessionToken = (await requireAuth().then(session => session.token));
    if (!sessionToken) throw new Error("Token de autenticação não encontrado.");

  const params = new URLSearchParams({
    taskId,
    filename,
  });

  const response = await fetch(`${API_URL}/upload/presigned-url?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao gerar URL de upload.");
  }

  return response.json();
}

export async function uploadFileToMinIO(presignedUrl: string, file: File) {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream", 
    },
    body: file, 
  });

  if (!response.ok) {
    throw new Error("Falha ao enviar arquivo para o storage.");
  }

  return true;
}