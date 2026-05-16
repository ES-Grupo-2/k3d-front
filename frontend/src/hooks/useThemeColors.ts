/**
 * @file Hook que expõe as cores efetivas do tema atual em formato `rgb(r g b)`
 * — necessário para passar cores para bibliotecas que não entendem CSS
 * variables nativamente (Recharts, react-hot-toast, etc.).
 * @author lukasnascimento1
 */
import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * Lê os valores efetivos das CSS variables (`--background`, `--surface`,
 * `--border`, `--foreground`, `--muted`, `--subtle`) e devolve um objeto com
 * strings RGB prontas para serem consumidas por libs externas.
 *
 * O retorno é memoizado e re-calculado sempre que o tema efetivo muda
 * (claro → escuro ou vice-versa), garantindo que gráficos e toasts se adaptem
 * dinamicamente quando o usuário troca o tema.
 *
 * **Onde é usado:** `OperationalDashboard.tsx` e `FinancialDashboard.tsx`
 * (passar as cores ao Recharts) e `ThemedToaster.tsx` (estilizar toasts).
 *
 * @returns objeto com as cores do tema corrente em formato `rgb(...)`
 */
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
