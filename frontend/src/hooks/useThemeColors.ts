import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

// Lê os valores efetivos das CSS vars para usar em libs externas (Recharts, etc.)
export function useThemeColors() {
  const { effective } = useTheme();
  return useMemo(() => {
    const s = getComputedStyle(document.documentElement);
    const rgb = (token: string) => `rgb(${s.getPropertyValue(token).trim()})`;
    return {
      background: rgb("--background"),
      surface: rgb("--surface"),
      border: rgb("--border"),
      foreground: rgb("--foreground"),
      muted: rgb("--muted"),
      subtle: rgb("--subtle"),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effective]);
}
