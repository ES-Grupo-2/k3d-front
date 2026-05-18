/**
 * @file Dashboard Operacional (rota `/dashboard/operational`). Layout EP com
 * cards `.ep-glass` para métricas e gráfico Recharts.
 * @author lukasnascimento1
 */
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
    <div className="p-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">
            Dashboard Operacional
          </h1>
          <p className="text-[13px] text-muted">Pedidos por categoria.</p>
        </div>
        <PeriodFilter period={period} setPeriod={setPeriod} />
      </header>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total no período" value={data?.totalOrders ?? 0} />
        <MetricCard title="Categorias ativas" value={data?.byCategory.length ?? 0} />
      </div>

      <div className="ep-glass p-6">
        <h2 className="font-bold text-[14px] uppercase tracking-wider text-faint mb-4">
          Pedidos por categoria
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.byCategory ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="name" stroke={colors.muted} fontSize={12} />
              <YAxis stroke={colors.muted} fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: colors.surfaceStrong,
                  border: `1px solid ${colors.borderStrong}`,
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: colors.foreground, fontWeight: 600 }}
                itemStyle={{ color: colors.foreground }}
              />
              <Bar dataKey="total" fill={colors.primary} radius={[6, 6, 0, 0]} />
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
    <div
      className="flex gap-1 p-1 rounded-xl"
      style={{
        background: "var(--ep-surface)",
        border: "1px solid var(--ep-border)",
      }}
    >
      {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
        <button
          key={p}
          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
          style={
            period === p
              ? {
                  background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(99,102,241,.3)",
                }
              : { color: "var(--ep-text-muted)" }
          }
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
    <div className="ep-glass p-5">
      <div className="text-[11px] text-faint uppercase tracking-[0.6px] font-semibold">{title}</div>
      <div className="text-[24px] font-extrabold mt-2 text-foreground tracking-tight">{value}</div>
    </div>
  );
}
