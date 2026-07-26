'use server'

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { API_URL } from "@/services/auth/config";
import { requireAuth } from "../auth/session";
import { TagRequest } from "@/types/tags";

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
 
export async function createTag(tag: TagRequest) {
  const session = await requireAuth();
  const token = session?.token;
  
  if (!token) throw new Error("Acesso não autorizado");
  
  const response = await fetch(`${API_URL}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tag),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    
    if (response.status === 409) {
      throw new Error(errorData?.message || "Esta tag já está cadastrada.");
    }
    
    throw new Error(errorData?.message || "Falha ao criar tag.");
  }

  return response.json();
}