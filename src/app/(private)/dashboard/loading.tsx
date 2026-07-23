/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
// Skeleton do Dashboard Operacional exibido via streaming enquanto o Server
// Component busca os dados no backend. Espelha o layout de OperationalDashboardView
// (header + 3 métricas + gráfico + tabela) para uma transição sem "pulos".
import { Card, CardContent, CardHeader } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";

export default function OperationalDashboardLoading() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-1 h-7 w-16" />
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-56" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
