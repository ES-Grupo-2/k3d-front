/**
 * @file Contexto global de tema. Suporta três modos (`light`, `dark`,
 * `system`), persiste a escolha em `localStorage` e responde dinamicamente a
 * mudanças do `prefers-color-scheme` do sistema operacional quando o modo
 * "system" estiver selecionado.
 * @author lukasnascimento1
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Modos de tema disponíveis. `system` segue a preferência do SO. */
export type Theme = "light" | "dark" | "system";

type ThemeCtx = {
  theme: Theme;
  effective: "light" | "dark";
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);
const STORAGE_KEY = "k3d:theme";

/**
 * Calcula o tema efetivo (`light` ou `dark`) a partir do valor escolhido pelo
 * usuário. Se o usuário escolheu `system`, consulta `prefers-color-scheme`
 * para decidir.
 *
 * @param theme - escolha do usuário (`light` | `dark` | `system`)
 * @returns o tema que será realmente aplicado no DOM
 */
function computeEffective(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

/**
 * Aplica (ou remove) a classe `dark` no `<html>`, ativando as CSS variables
 * do tema escuro definidas em `index.css`.
 *
 * @param effective - tema efetivo já calculado
 */
function applyClass(effective: "light" | "dark") {
  document.documentElement.classList.toggle("dark", effective === "dark");
}

/**
 * Provider de tema. Inicializa o estado a partir do `localStorage`, sincroniza
 * com a CSS class do `<html>` e escuta mudanças do `prefers-color-scheme`
 * quando o modo "system" está ativo.
 *
 * **Onde é usado:** envolve toda a aplicação em `main.tsx`, no nível mais
 * externo (acima do `QueryClientProvider`).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored ?? "system";
  });
  const [effective, setEffective] = useState<"light" | "dark">(() => computeEffective(theme));

  // Sempre que a escolha do usuário muda, recalcula o tema efetivo,
  // aplica a classe `dark` no <html> e persiste no localStorage.
  useEffect(() => {
    const e = computeEffective(theme);
    setEffective(e);
    applyClass(e);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Reage a mudanças do `prefers-color-scheme` quando o usuário escolheu
  // "system" (ex.: macOS alternando claro/escuro automaticamente).
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const e = computeEffective("system");
      setEffective(e);
      applyClass(e);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  /**
   * Atualiza o tema escolhido pelo usuário. Persiste no `localStorage` via
   * o efeito acima.
   *
   * **Onde é usada:** `ThemeSwitcher.tsx` (botões ☀ / ☾ / ⎚).
   */
  function setTheme(t: Theme) {
    setThemeState(t);
  }

  /**
   * Cicla entre os três modos na ordem `light → dark → system → light…`.
   * Não está sendo usada atualmente na UI, mas fica disponível como API
   * alternativa para futuros toggles de um botão único.
   */
  function toggle() {
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  }

  return <Ctx.Provider value={{ theme, effective, setTheme, toggle }}>{children}</Ctx.Provider>;
}

/**
 * Hook de conveniência para consumir o `ThemeContext`. Lança um erro se for
 * usado fora do `ThemeProvider`.
 *
 * **Onde é usado:** `ThemeSwitcher.tsx` (para ler e setar o tema) e
 * `useThemeColors.ts` (para reagir a mudanças de tema).
 *
 * @returns objeto com `theme`, `effective`, `setTheme`, `toggle`
 */
export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme fora do ThemeProvider");
  return ctx;
}
