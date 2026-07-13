// Gráfico de barras "pedidos por categoria" do dashboard operacional. Componente
// client porque o Recharts renderiza no navegador; as cores seguem o tema via
// useChartTheme.
// Author: lukasnascimento1
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { OperationalDashboardData } from "@/schemas/dashboard";
import { useChartTheme } from "./chart-theme";

interface OperationalChartProps {
  data: OperationalDashboardData["byCategory"];
}

export function OperationalChart({ data }: OperationalChartProps) {
  const theme = useChartTheme();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" stroke={theme.axis} tick={{ fontSize: 12 }} />
          <YAxis stroke={theme.axis} allowDecimals={false} width={32} />
          <Tooltip
            cursor={{ fill: theme.grid, opacity: 0.3 }}
            contentStyle={{
              background: theme.surface,
              border: `1px solid ${theme.grid}`,
              borderRadius: 12,
            }}
            labelStyle={{ color: theme.foreground }}
            itemStyle={{ color: theme.foreground }}
          />
          <Bar dataKey="total" name="Pedidos" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.tagId} fill={entry.color || theme.primary} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
