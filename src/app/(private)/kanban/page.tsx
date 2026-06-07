import { redirect } from "next/navigation";
import { getSession } from "@/services/auth/session";
import KanbanView from "../../../components/kanban/KanbanView";

export default async function KanbanPage() {
    const session = await getSession();
    if(!session) redirect("/auth/login");

    const isManager = session.user.role === "GERENTE";

    return (
     <KanbanView isManager={isManager} />
    );
}
