import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../api/client";
import type { FinancialDashboardData } from "../api/types";
import { currency } from "../lib/format";
import { MetricCard, PeriodFilter } from "./OperationalDashboard";
import { useThemeColors } from "../hooks/useThemeColors";

type Period = "WEEKLY" | "MONTHLY" | "SEMIANNUAL";

export function FinancialDashboardPage() {
  const [period, setPeriod] = useState<Period>("MONTHLY");
  const colors = useThemeColors();

  const { data } = useQuery<FinancialDashboardData>({
    queryKey: ["dash-fin", period],
    queryFn: () => api.get(`/dashboard/financial?period=${period}`).then((r) => r.data),
  });

  const chartData = data
    ? [
        { name: "Receita", value: data.revenue },
        { name: "Custo", value: data.cost },
        { name: "Lucro", value: data.profit },
      ]
    : [];

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Financeiro</h1>
          <p className="text-sm text-muted">Receita, lucro, custo e ticket médio</p>
        </div>
        <PeriodFilter period={period} setPeriod={setPeriod} />
      </header>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Receita" value={currency(data?.revenue ?? 0)} />
        <MetricCard title="Custo" value={currency(data?.cost ?? 0)} />
        <MetricCard title="Lucro" value={currency(data?.profit ?? 0)} />
        <MetricCard title="Ticket médio" value={currency(data?.averageTicket ?? 0)} />
      </div>

      <div className="panel p-5">
        <h2 className="font-semibold mb-4 text-foreground">Comparativo</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="name" stroke={colors.muted} />
              <YAxis stroke={colors.muted} />
              <Tooltip
                contentStyle={{ background: colors.surface, border: `1px solid ${colors.border}` }}
                labelStyle={{ color: colors.foreground }}
                itemStyle={{ color: colors.foreground }}
                formatter={(v: number) => currency(v)}
              />
              <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
