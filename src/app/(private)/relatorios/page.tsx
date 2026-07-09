import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { requireRole } from "@/services/auth/session";

export default async function RelatoriosPage() {
  // Rota exclusiva do perfil Gerente (redireciona os demais para /dashboard).
  await requireRole("GERENTE");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios</CardTitle>
        <CardDescription>
          Indicadores e relatórios gerenciais.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Este módulo será desenvolvido em uma próxima task.
      </CardContent>
    </Card>
  );
}
