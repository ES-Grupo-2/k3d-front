/**
 * @file Wrapper do `<Toaster />` do react-hot-toast que aplica as cores do
 * tema corrente. Necessário porque a lib não consome CSS variables
 * automaticamente.
 * @author lukasnascimento1
 */
import { Toaster } from "react-hot-toast";
import { useThemeColors } from "../hooks/useThemeColors";

/**
 * Renderiza o `<Toaster />` global da aplicação, com estilo que respeita o
 * tema (claro/escuro). Ao trocar de tema, o `useThemeColors` recalcula as
 * cores e o Toaster re-renderiza com o novo estilo.
 *
 * **Onde é usado:** em `main.tsx`, irmão de `<App />`, dentro do
 * `AuthProvider`.
 */
export function ThemedToaster() {
  const colors = useThemeColors();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: colors.surface,
          color: colors.foreground,
          border: `1px solid ${colors.border}`,
        },
      }}
    />
  );
}
