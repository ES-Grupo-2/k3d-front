import { useAuthStore } from "@/store/auth";
import { KanbanResponse, KanbanColumnNames } from "@/types/kanban";
import { API_URL } from "@/services/auth/config";
import { Content } from "next/font/google";


export async function fetchKanbanBoard(token: string){
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };

    const columnNames: KanbanColumnNames[] = ["A_FAZER", "FAZENDO", "FINALIZADO"];

    /**
     * Fetch the kanban board data for all columns in parallel 
     */
    const requests = columnNames.map((column) =>
        fetch(`${API_URL}/kanban/${column}`, { headers })
    .then(async (res) => {
            if (!res.ok) throw new Error(`Failed to fetch orders from column: ${column}`);
      return res.json() as Promise<KanbanResponse>;
    }))

    const [todoResponse, doingResponse, doneResponse] = await Promise.all(requests);
    return {
        A_FAZER: todoResponse.data,
        FAZENDO: doingResponse.data,
        FINALIZADO: doneResponse.data,
    };
};   