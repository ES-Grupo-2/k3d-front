'use server'
import { API_URL } from "@/services/auth/config";
import { requireAuth } from "../auth/session";

export type TagResponse = {
  id: number;
  type: string;
};

export async function getTags() {
  const session = await requireAuth();
  const token = session?.token;
  
  if (!token) throw new Error("Acesso não autorizado");

  const response = await fetch(`${API_URL}/tags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao buscar a lista de tags.");
  }
  
  const jsonResponse = await response.json();
  
  return jsonResponse.data || jsonResponse;
}