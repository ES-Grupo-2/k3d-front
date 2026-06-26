import { KanbanResponse, KanbanTaskStatus } from "@/types/kanban";
import { API_URL } from "@/services/auth/config";

export async function fetchKanbanBoard(token: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
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