import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api/client";
import type { OperationalDashboardData } from "../api/types";
import { useThemeColors } from "../hooks/useThemeColors";

type Period = "WEEKLY" | "MONTHLY" | "SEMIANNUAL";

const PERIOD_LABELS: Record<Period, string> = {
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  SEMIANNUAL: "Semestral",
};

export function OperationalDashboardPage() {
  const [period, setPeriod] = useState<Period>("MONTHLY");
  const colors = useThemeColors();

  const { data } = useQuery<OperationalDashboardData>({
    queryKey: ["dash-op", period],
    queryFn: () => api.get(`/dashboard/operational?period=${period}`).then((r) => r.data),
  });

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Operacional</h1>
          <p className="text-sm text-muted">Pedidos por categoria</p>
        </div>
        <PeriodFilter period={period} setPeriod={setPeriod} />
      </header>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total no período" value={data?.totalOrders ?? 0} />
        <MetricCard title="Categorias ativas" value={data?.byCategory.length ?? 0} />
      </div>

      <div className="panel p-5">
        <h2 className="font-semibold mb-4 text-foreground">Pedidos por categoria</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.byCategory ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="name" stroke={colors.muted} />
              <YAxis stroke={colors.muted} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}` }}
                labelStyle={{ color: colors.foreground }}
                itemStyle={{ color: colors.foreground }}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function PeriodFilter({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (p: Period) => void;
}) {
  return (
    <div className="flex gap-1 panel p-1">
      {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
        <button
          key={p}
          className={`btn text-xs ${period === p ? "bg-primary text-white" : "text-muted hover:text-foreground"}`}
          onClick={() => setPeriod(p)}
        >
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );
}

export function MetricCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="panel p-4">
      <div className="text-xs text-muted uppercase tracking-wide">{title}</div>
      <div className="text-2xl font-bold mt-1 text-foreground">{value}</div>
    </div>
  );
}
