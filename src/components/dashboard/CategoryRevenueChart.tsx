// Gráfico de receita empilhada por categoria (Chaveiros, Brindes, etc.), na
// horizontal. Agrega a receita por tag a partir do detalhamento por produto —
// o backend não expõe esse recorte pronto, então a soma é feita no cliente.
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
import type { ProductBreakdown } from "@/schemas/dashboard/dashboard";
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
  products: ProductBreakdown[];
}

export function CategoryRevenueChart({ products }: CategoryRevenueChartProps) {
  const theme = useChartTheme();

  // Soma a receita por categoria (tag).
  const totals = new Map<string, number>();
  for (const product of products) {
    const key = product.tagName || "Sem categoria";
    totals.set(key, (totals.get(key) ?? 0) + product.revenue);
  }
  const categories = Array.from(totals.keys());

  // Uma única linha ("Receita") com um segmento empilhado por categoria.
  const row: Record<string, number | string> = { name: "Receita" };
  categories.forEach((category) => {
    row[category] = totals.get(category) ?? 0;
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
              key={category}
              dataKey={category}
              stackId="revenue"
              name={category}
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
