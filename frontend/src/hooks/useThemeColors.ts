/**
 * @file Hook que expõe as cores efetivas do tema atual em formato consumível
 * por bibliotecas que não entendem CSS variables (Recharts, react-hot-toast).
 *
 * Os valores são lidos das CSS variables --ep-* via getComputedStyle e
 * recalculados sempre que o tema muda.
 * @author lukasnascimento1
 */
import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

export function useThemeColors() {
  const { effective } = useTheme();
  return useMemo(() => {
    const s = getComputedStyle(document.documentElement);
    const v = (token: string) => s.getPropertyValue(token).trim();
    return {
      background: v("--ep-bg"),
      surface: v("--ep-surface"),
      surfaceStrong: v("--ep-surface-strong"),
      border: v("--ep-border"),
      borderStrong: v("--ep-border-strong"),
      foreground: v("--ep-text"),
      muted: v("--ep-text-muted"),
      faint: v("--ep-text-faint"),
      primary: v("--ep-primary"),
      accent: v("--ep-accent"),
      success: v("--ep-success"),
      error: v("--ep-error"),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effective]);
}
