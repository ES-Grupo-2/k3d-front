// Gráfico de colunas com a receita de cada categoria (Chaveiros, Brindes, etc.)
// no período. Segue o mesmo desenho do gráfico de pedidos por categoria do
// dashboard operacional, para que os dois sejam lidos da mesma forma.
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

import { currency } from "@/lib/utils";
import type { CategoryRevenue } from "@/schemas/dashboard/dashboard";
import { useChartTheme } from "./chart-theme";

interface CategoryRevenueChartProps {
  categories: CategoryRevenue[];
}

export function CategoryRevenueChart({
  categories,
}: CategoryRevenueChartProps) {
  const theme = useChartTheme();

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={categories} margin={{ left: 8, right: 12, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            dataKey="name"
            stroke={theme.axis}
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            stroke={theme.axis}
            width={72}
            tickFormatter={(value: number) => currency(value)}
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
            formatter={(value) => [currency(Number(value)), "Receita"]}
          />
          <Bar
            dataKey="revenue"
            name="Receita"
            fill={theme.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={72}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
