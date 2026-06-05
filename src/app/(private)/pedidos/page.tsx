import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { requireAuth } from "@/services/auth/session";

export default async function PedidosPage() {
  await requireAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos</CardTitle>
        <CardDescription>Gerencie os pedidos da operação.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Este módulo será desenvolvido em uma próxima task.
      </CardContent>
    </Card>
  );
}
