// Gráfico de barras "pedidos por categoria" do dashboard operacional. Componente
// client porque o Recharts renderiza no navegador; as cores seguem o tema via
// useChartTheme.
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

import type { OperationalDashboardData } from "@/schemas/dashboard/dashboard";
import { useChartTheme } from "./chart-theme";

interface OperationalChartProps {
  data: OperationalDashboardData["byCategory"];
}

export function OperationalChart({ data }: OperationalChartProps) {
  const theme = useChartTheme();

  const chartData = data.map((entry) => ({
    ...entry,
    fill: entry.color || theme.primary,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
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
          
          <Bar 
            dataKey="total" 
            name="Pedidos" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}