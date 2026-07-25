// Gráfico de linha (série temporal) por dia. Reutilizado nos dois dashboards:
// o operacional plota o volume de pedidos e o financeiro plota a receita, ambos
// ao longo do período. As datas vêm como "YYYY-MM-DD".
// Author: lukasnascimento1
"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { currency } from "@/lib/utils";
import type { DailyPoint } from "@/schemas/dashboard/dashboard";
import { useChartTheme } from "./chart-theme";

interface DailyLineChartProps {
  data: DailyPoint[];
  dataKey: "revenue" | "orders";
  kind: "currency" | "count";
  label: string;
}

// "YYYY-MM-DD" -> "DD/MM" sem passar por Date (evita deslocamento por timezone).
function formatDay(value: string): string {
  const [, month, day] = value.split("-");
  return day && month ? `${day}/${month}` : value;
}

export function DailyLineChart({
  data,
  dataKey,
  kind,
  label,
}: DailyLineChartProps) {
  const theme = useChartTheme();
  const format = (value: number) =>
    kind === "currency" ? currency(value) : String(value);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 12, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            dataKey="date"
            stroke={theme.axis}
            tick={{ fontSize: 12 }}
            tickFormatter={formatDay}
            minTickGap={16}
          />
          <YAxis
            stroke={theme.axis}
            width={kind === "currency" ? 72 : 40}
            allowDecimals={false}
            tickFormatter={(value: number) => format(value)}
          />
          <Tooltip
            cursor={{ stroke: theme.grid }}
            contentStyle={{
              background: theme.surface,
              border: `1px solid ${theme.grid}`,
              borderRadius: 12,
            }}
            labelStyle={{ color: theme.foreground }}
            itemStyle={{ color: theme.foreground }}
            labelFormatter={(value) => formatDay(String(value))}
            formatter={(value) => [format(Number(value)), label]}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke={theme.primary}
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
