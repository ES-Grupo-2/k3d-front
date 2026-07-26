// Gráfico comparativo (Receita × Custo × Lucro) do dashboard financeiro.
// Componente client (Recharts); os valores no tooltip são formatados em R$.
// Author: lukasnascimento1
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { compactCurrency, currency } from "@/lib/utils";
import type { FinancialDashboardData } from "@/schemas/dashboard/dashboard";
import { buildValueScale } from "./chart-scale";
import { useChartTheme } from "./chart-theme";

interface FinancialChartProps {
  data: FinancialDashboardData;
}

export function FinancialChart({ data }: FinancialChartProps) {
  const theme = useChartTheme();

  // Verde de lucro fixo (não há token dedicado no tema); receita e custo usam
  // primary/destructive do tema.
  const chartData = [
    { name: "Receita", value: data.revenue, fill: theme.primary },
    { name: "Custo", value: data.cost, fill: theme.destructive },
    { name: "Lucro", value: data.profit, fill: "#22c55e" },
  ];

  const scale = buildValueScale(chartData.map((entry) => entry.value));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" stroke={theme.axis} tick={{ fontSize: 12 }} />
          <YAxis
            stroke={theme.axis}
            width={72}
            domain={scale.domain}
            ticks={scale.ticks}
            tickFormatter={(value: number) => compactCurrency(value)}
          />
          <Tooltip
            cursor={{ fill: theme.grid, opacity: 0.3 }}
            contentStyle={{
              background: theme.surface,
              border: `1px solid ${theme.grid}`,
              borderRadius: 12,
            }}
            labelStyle={{ color: theme.foreground }}
            itemStyle={{ color: theme.foreground }}
            formatter={(value) => currency(Number(value))}
          />
          <Bar 
            dataKey="value" 
            name="Valor" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
