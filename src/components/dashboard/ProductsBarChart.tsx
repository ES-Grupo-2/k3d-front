// Gráfico de barras horizontais por produto. Reutilizado nos dois dashboards:
// o financeiro plota receita (R$) e o operacional plota quantidade. As barras
// herdam a cor da categoria (tag) de cada produto.
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
import type { ProductBreakdown } from "@/schemas/dashboard/dashboard";
import { useChartTheme } from "./chart-theme";

interface ProductsBarChartProps {
  products: ProductBreakdown[];
  dataKey: keyof ProductBreakdown;
  kind: "currency" | "count";
  label: string;
}

export function ProductsBarChart({
  products,
  dataKey,
  kind,
  label,
}: ProductsBarChartProps) {
  const theme = useChartTheme();
  const format = (value: number) =>
    kind === "currency" ? currency(value) : String(value);

  const chartData = products.map((product) => ({
    ...product,
    fill: product.tagColor || theme.primary,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 16, right: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            type="number"
            stroke={theme.axis}
            tickFormatter={(value: number) => format(value)}
            allowDecimals={kind === "currency"}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={theme.axis}
            width={130}
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
            formatter={(value) => format(Number(value))}
          />
          <Bar 
            dataKey={dataKey} 
            name={label} 
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
