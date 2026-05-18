/**
 * @file Contexto global de tema. Suporta três modos (`light`, `dark`,
 * `system`), persiste a escolha em `localStorage` e responde dinamicamente a
 * mudanças do `prefers-color-scheme` quando o modo "system" está selecionado.
 *
 * Espelha o sistema de tema do EyePleasure: usa o atributo
 * `data-theme="light"` no `<html>` (não a classe `.dark`) para alternar entre
 * dark (padrão) e light (override).
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

function computeEffective(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

function applyAttribute(effective: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", effective);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", effective === "light" ? "#f6f6fb" : "#08080f");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored ?? "system";
  });
  const [effective, setEffective] = useState<"light" | "dark">(() => computeEffective(theme));

  useEffect(() => {
    const e = computeEffective(theme);
    setEffective(e);
    applyAttribute(e);
    // Persistência: salva quando o usuário escolheu manualmente; remove para
    // voltar a seguir o SO se a escolha for "system".
    if (theme === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Reage a mudanças do `prefers-color-scheme` quando o usuário escolheu "system"
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const e = computeEffective("system");
      setEffective(e);
      applyAttribute(e);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  function setTheme(t: Theme) {
    // Adiciona classe de transição suave para evitar mudanças bruscas
    document.documentElement.classList.add("ep-theme-transition");
    window.setTimeout(() => {
      document.documentElement.classList.remove("ep-theme-transition");
    }, 400);
    setThemeState(t);
  }

  function toggle() {
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  }

  return <Ctx.Provider value={{ theme, effective, setTheme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme fora do ThemeProvider");
  return ctx;
}
