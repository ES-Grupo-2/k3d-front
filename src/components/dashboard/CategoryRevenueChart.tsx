// Gráfico de receita empilhada por categoria (Chaveiros, Brindes, etc.), na
// horizontal: uma única barra em que cada segmento é uma categoria, o que deixa
// visível tanto o peso relativo de cada uma quanto a receita total do período.
// Author: lukasnascimento1
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { currency } from "@/lib/utils";
import type { CategoryRevenue } from "@/schemas/dashboard/dashboard";
import { useChartTheme } from "./chart-theme";

// Paleta categórica (o backend ainda não fornece cor por tag).
const CATEGORY_COLORS = [
  "#ffc94d",
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#ef4444",
];

interface CategoryRevenueChartProps {
  categories: CategoryRevenue[];
}

export function CategoryRevenueChart({
  categories,
}: CategoryRevenueChartProps) {
  const theme = useChartTheme();

  // Uma única linha ("Receita") com um segmento empilhado por categoria.
  const row: Record<string, number | string> = { name: "Receita" };
  categories.forEach((category) => {
    row[category.name] = category.revenue;
  });
  const data = [row];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 16, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            type="number"
            stroke={theme.axis}
            tickFormatter={(value: number) => currency(value)}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={theme.axis}
            width={72}
            tick={{ fontSize: 12 }}
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
          <Legend />
          {categories.map((category, index) => (
            <Bar
              key={category.name}
              dataKey={category.name}
              stackId="revenue"
              name={category.name}
              fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
              barSize={56}
              radius={
                index === categories.length - 1 ? [0, 4, 4, 0] : undefined
              }
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
