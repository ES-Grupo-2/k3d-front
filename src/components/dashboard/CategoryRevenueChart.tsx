// Gráfico de barras horizontais com a receita de cada categoria (Chaveiros,
// Brindes, etc.) no período: categorias no eixo Y e valores em R$ no eixo X,
// o que evita truncar nomes longos de categoria.
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
import type { CategoryRevenue } from "@/schemas/dashboard/dashboard";
import { buildValueScale } from "./chart-scale";
import { useChartTheme } from "./chart-theme";

interface CategoryRevenueChartProps {
  categories: CategoryRevenue[];
}

export function CategoryRevenueChart({
  categories,
}: CategoryRevenueChartProps) {
  const theme = useChartTheme();
  const scale = buildValueScale(categories.map((category) => category.revenue));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categories}
          layout="vertical"
          margin={{ left: 8, right: 24, top: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            type="number"
            stroke={theme.axis}
            tick={{ fontSize: 12 }}
            domain={scale.domain}
            ticks={scale.ticks}
            tickFormatter={(value: number) => compactCurrency(value)}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={theme.axis}
            tick={{ fontSize: 12 }}
            width={96}
            interval={0}
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
            radius={[0, 4, 4, 0]}
            maxBarSize={72}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
