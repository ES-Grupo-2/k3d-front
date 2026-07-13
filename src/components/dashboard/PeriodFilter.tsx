// Filtro de período (Semanal · Mensal · Semestral) dos dashboards. Cada opção
// é um link que atualiza o parâmetro ?period da URL, deixando a página (Server
// Component) refazer a busca — sem estado no cliente.
// Author: lukasnascimento1
import Link from "next/link";

import { cn } from "@/lib/utils";
import { PERIOD_LABELS, PERIODS, type Period } from "@/schemas/dashboard";

interface PeriodFilterProps {
  basePath: string;
  period: Period;
}

export function PeriodFilter({ basePath, period }: PeriodFilterProps) {
  return (
    <div className="border-border bg-card flex gap-1 rounded-2xl border p-1">
      {PERIODS.map((option) => {
        const isActive = option === period;

        return (
          <Link
            key={option}
            href={`${basePath}?period=${option}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {PERIOD_LABELS[option]}
          </Link>
        );
      })}
    </div>
  );
}
