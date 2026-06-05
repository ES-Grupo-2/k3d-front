import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { requireAuth } from "@/services/auth/session";

export default async function KanbanPage() {
  await requireAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kanban</CardTitle>
        <CardDescription>
          Acompanhe o fluxo de produção em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Este módulo será desenvolvido em uma próxima task.
      </CardContent>
    </Card>
  );
}
