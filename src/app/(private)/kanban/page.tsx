import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { requireAuth } from "@/services/auth/session";

export default async function KanbanPage() {
  await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Kanban</h2>
        <p className="text-muted-foreground text-sm">
          Clique em um card para editar ou use a lixeira para excluir. Quadro de
          demonstração com dados de exemplo.
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}
