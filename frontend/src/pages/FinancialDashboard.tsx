/**
 * @file Dashboard Financeiro (rota `/dashboard/financial`). Restrito ao
 * MANAGER. Combina visão geral (receita/custo/lucro/ticket médio) e
 * detalhamento por produto (top produtos por receita e por lucro, tabela
 * completa).
 * @author lukasnascimento1
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { api } from "../api/client";
import type { FinancialDashboardData, ProductsBreakdownData } from "../api/types";
import { currency } from "../lib/format";
import { MetricCard, PeriodFilter } from "./OperationalDashboard";
import { useThemeColors } from "../hooks/useThemeColors";

type Period = "WEEKLY" | "MONTHLY" | "SEMIANNUAL";

export function FinancialDashboardPage() {
  const [period, setPeriod] = useState<Period>("MONTHLY");
  const colors = useThemeColors();

  const { data: aggregate } = useQuery<FinancialDashboardData>({
    queryKey: ["dash-fin", period],
    queryFn: () => api.get(`/dashboard/financial?period=${period}`).then((r) => r.data),
  });

  const { data: byProduct } = useQuery<ProductsBreakdownData>({
    queryKey: ["dash-fin-products", period],
    queryFn: () =>
      api.get(`/dashboard/financial/products?period=${period}`).then((r) => r.data),
  });

  const compareData = aggregate
    ? [
        { name: "Receita", value: aggregate.revenue },
        { name: "Custo", value: aggregate.cost },
        { name: "Lucro", value: aggregate.profit },
      ]
    : [];

  // Top N produtos limitados visualmente nos gráficos para evitar sobrecarga.
  const TOP_N = 10;
  const products = byProduct?.products ?? [];
  const topByRevenue = products.slice(0, TOP_N);
  const topByProfit = [...products].sort((a, b) => b.profit - a.profit).slice(0, TOP_N);

  return (
    <div className="p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">
            Dashboard Financeiro
          </h1>
          <p className="text-[13px] text-muted">Receita, lucro, custo e ticket médio.</p>
        </div>
        <PeriodFilter period={period} setPeriod={setPeriod} />
      </header>

      {/* Visão geral */}
      <section className="space-y-4">
        <h2 className="font-bold text-[12px] uppercase tracking-[0.6px] text-faint">
          Visão geral
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard title="Receita" value={currency(aggregate?.revenue ?? 0)} />
          <MetricCard title="Custo" value={currency(aggregate?.cost ?? 0)} />
          <MetricCard title="Lucro" value={currency(aggregate?.profit ?? 0)} />
          <MetricCard title="Ticket médio" value={currency(aggregate?.averageTicket ?? 0)} />
        </div>

        <div className="ep-glass p-6">
          <h3 className="font-bold text-[13px] uppercase tracking-wider text-faint mb-4">
            Comparativo (período)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="name" stroke={colors.muted} fontSize={12} />
                <YAxis stroke={colors.muted} fontSize={12} />
                <Tooltip
                  contentStyle={chartTooltipStyle(colors)}
                  labelStyle={{ color: colors.foreground, fontWeight: 600 }}
                  itemStyle={{ color: colors.foreground }}
                  formatter={(v: number) => currency(v)}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {compareData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.name === "Receita"
                          ? colors.primary
                          : entry.name === "Custo"
                            ? colors.error
                            : colors.success
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Por produto */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[12px] uppercase tracking-[0.6px] text-faint">
            Por produto
          </h2>
          <span className="text-[11px] text-faint">
            {products.length} {products.length === 1 ? "produto" : "produtos"} no período
          </span>
        </div>

        {products.length === 0 ? (
          <div className="ep-glass p-10 text-center text-[13px] text-muted">
            Nenhum pedido encontrado no período selecionado.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6">
              <ChartCard title="Top produtos por receita">
                <ResponsiveContainer width="100%" height={Math.max(220, topByRevenue.length * 36)}>
                  <BarChart
                    data={topByRevenue}
                    layout="vertical"
                    margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={false} />
                    <XAxis type="number" stroke={colors.muted} fontSize={11} tickFormatter={(v) => `R$${v}`} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke={colors.muted}
                      fontSize={11}
                      width={120}
                      tick={{ fill: colors.foreground }}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle(colors)}
                      labelStyle={{ color: colors.foreground, fontWeight: 600 }}
                      itemStyle={{ color: colors.foreground }}
                      formatter={(v: number) => currency(v)}
                    />
                    <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                      {topByRevenue.map((p, i) => (
                        <Cell key={i} fill={p.tagColor || colors.primary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Top produtos por lucro">
                <ResponsiveContainer width="100%" height={Math.max(220, topByProfit.length * 36)}>
                  <BarChart
                    data={topByProfit}
                    layout="vertical"
                    margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={false} />
                    <XAxis type="number" stroke={colors.muted} fontSize={11} tickFormatter={(v) => `R$${v}`} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke={colors.muted}
                      fontSize={11}
                      width={120}
                      tick={{ fill: colors.foreground }}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle(colors)}
                      labelStyle={{ color: colors.foreground, fontWeight: 600 }}
                      itemStyle={{ color: colors.foreground }}
                      formatter={(v: number) => currency(v)}
                    />
                    <Bar dataKey="profit" fill={colors.success} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Tabela detalhada */}
            <div className="ep-glass overflow-hidden">
              <header className="px-5 py-4 border-b border-border">
                <h3 className="font-bold text-[13px] uppercase tracking-wider text-faint">
                  Detalhamento completo
                </h3>
              </header>
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th style={{ textAlign: "right" }}>Pedidos</th>
                    <th style={{ textAlign: "right" }}>Qtde total</th>
                    <th style={{ textAlign: "right" }}>Receita</th>
                    <th style={{ textAlign: "right" }}>Custo</th>
                    <th style={{ textAlign: "right" }}>Lucro</th>
                    <th style={{ textAlign: "right" }}>Margem</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.name}>
                      <td style={{ color: "var(--ep-text)", fontWeight: 600 }}>{p.name}</td>
                      <td>
                        <span
                          className="status-pill"
                          style={{ background: `${p.tagColor}26`, color: p.tagColor }}
                        >
                          {p.tagName}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", color: "var(--ep-text-muted)" }}>{p.orders}</td>
                      <td style={{ textAlign: "right", color: "var(--ep-text-muted)" }}>{p.quantity}</td>
                      <td style={{ textAlign: "right", color: "var(--ep-text)", fontWeight: 600 }}>
                        {currency(p.revenue)}
                      </td>
                      <td style={{ textAlign: "right", color: "var(--ep-text-muted)" }}>
                        {currency(p.cost)}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: p.profit >= 0 ? "var(--ep-success-soft)" : "var(--ep-error-soft)",
                          fontWeight: 700,
                        }}
                      >
                        {currency(p.profit)}
                      </td>
                      <td style={{ textAlign: "right", color: "var(--ep-text-muted)" }}>
                        {p.profitMarginPercent.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ep-glass p-6">
      <h3 className="font-bold text-[13px] uppercase tracking-wider text-faint mb-4">{title}</h3>
      {children}
    </div>
  );
}

function chartTooltipStyle(colors: ReturnType<typeof useThemeColors>) {
  return {
    background: colors.surfaceStrong,
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: 12,
    fontSize: 12,
  } as const;
}
