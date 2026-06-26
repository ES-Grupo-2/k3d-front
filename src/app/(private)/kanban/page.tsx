import { requireAuth } from "@/services/auth/session";
import { KanbanClient } from "../../../components/kanban/KanbanClient";

export default async function KanbanPage() {
  const { user } = await requireAuth();
  const isManager = user.role === "GERENTE";

  return <KanbanClient isManager={isManager} />;
}
