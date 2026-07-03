"use server"
import { API_URL } from "../auth/config";
import { CreateClientDTO } from "@/types/order";
import { requireAuth } from "../auth/session";

// 1. POST /clients - Criação de Cliente
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

  // Retorna o objeto do cliente criado (espera-se que venha com o ID gerado)
  return response.json(); 
}

// 2. GET /clients/:id - Busca de Cliente (Para uso futuro/detalhamento)
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

// 3. GET /upload/presigned-url - Permissão de Upload
export async function getPresignedUrl(taskId: string, filename: string) {
    const sessionToken = (await requireAuth().then(session => session.token));
    if (!sessionToken) throw new Error("Token de autenticação não encontrado.");

    // Monta a query string
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

  // Retorna { url: string, expiresIn: number }
  return response.json();
}

// 4. PUT DIRETO NO MINIO (A mágica do frontend)
// Esta função não bate no seu backend, ela bate direto na URL retornada pela função acima!
export async function uploadFileToMinIO(presignedUrl: string, file: File) {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    // Opcional, mas recomendado passar o Content-Type real do arquivo
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