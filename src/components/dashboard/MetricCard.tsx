// Card de métrica dos dashboards: um rótulo pequeno em caixa alta e um valor
// grande em destaque. Reutilizado nos dashboards operacional e financeiro para
// manter consistência visual entre as telas.
// Author: lukasnascimento1
import { Card } from "@/components/ui";

interface MetricCardProps {
  title: string;
  value: number | string;
}

export function MetricCard({ title, value }: MetricCardProps) {
  return (
    <Card className="p-4">
      <div className="text-muted-foreground text-xs tracking-wide uppercase">
        {title}
      </div>
      <div className="text-foreground mt-1 text-2xl font-bold">{value}</div>
    </Card>
  );
}
