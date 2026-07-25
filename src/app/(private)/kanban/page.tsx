import { requireAuth } from "@/services/auth/session";
import { KanbanClient } from "../../../components/kanban/KanbanClient";
import { fetchKanbanBoard } from "@/services/kanban/kanban";

export default async function KanbanPage() {
  const session = await requireAuth();
  const kanbanOrders = await fetchKanbanBoard(session.token);
  const isManager = session.user?.role === "GERENTE";

  return <KanbanClient isManager={isManager} ordersRequest={kanbanOrders} />;
}
