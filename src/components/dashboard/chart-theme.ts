// Expõe as cores efetivas do tema (CSS variables) para o Recharts, que não
// entende `var(--token)` nativamente nos eixos/grid/tooltip. Lê os valores
// computados no cliente; o app usa um tema escuro único, então basta ler uma vez.
// Author: lukasnascimento1
"use client";

import { useState } from "react";

export interface ChartTheme {
  grid: string;
  axis: string;
  surface: string;
  foreground: string;
  primary: string;
  destructive: string;
}

// Fallbacks alinhados ao :root de globals.css (tema escuro dourado). Usados no
// SSR, onde não há `document` para ler os valores computados.
const FALLBACK: ChartTheme = {
  grid: "rgba(248, 236, 202, 0.35)",
  axis: "#f3f3f3",
  surface: "#222525",
  foreground: "#ffffff",
  primary: "#ffc94d",
  destructive: "#ef4444",
};

function readTheme(): ChartTheme {
  if (typeof document === "undefined") {
    return FALLBACK;
  }

  const styles = getComputedStyle(document.documentElement);
  const read = (token: string, fallback: string) =>
    styles.getPropertyValue(token).trim() || fallback;

  return {
    grid: read("--border", FALLBACK.grid),
    axis: read("--muted-foreground", FALLBACK.axis),
    surface: read("--card", FALLBACK.surface),
    foreground: read("--foreground", FALLBACK.foreground),
    primary: read("--primary", FALLBACK.primary),
    destructive: read("--destructive", FALLBACK.destructive),
  };
}

export function useChartTheme(): ChartTheme {
  // Inicializador lazy: lê o tema uma única vez na montagem do cliente.
  const [theme] = useState<ChartTheme>(readTheme);
  return theme;
}
