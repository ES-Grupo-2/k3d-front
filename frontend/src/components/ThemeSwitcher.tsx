/**
 * @file Alternador visual de tema (☀ claro / ☾ escuro / ⎚ sistema).
 * Pequeno grupo de três botões que reflete e atualiza o `ThemeContext`.
 * @author lukasnascimento1
 */
import { useTheme, type Theme } from "../context/ThemeContext";

/**
 * Definição das opções exibidas no alternador. Mantida fora do componente
 * para evitar realocação a cada render.
 */
const OPTIONS: { value: Theme; title: string; icon: string }[] = [
  { value: "light", title: "Tema claro", icon: "☀" },
  { value: "dark", title: "Tema escuro", icon: "☾" },
  { value: "system", title: "Seguir sistema", icon: "⎚" },
];

/**
 * Componente que renderiza os três botões de tema. O botão correspondente ao
 * tema corrente recebe destaque visual (`bg-primary`). Cada clique chama
 * `setTheme` do contexto, que persiste no `localStorage` e aplica a classe
 * `dark` no `<html>`.
 *
 * **Onde é usado:** rodapé da sidebar em `Layout.tsx`.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1 bg-background border border-border rounded-md p-0.5">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          title={o.title}
          onClick={() => setTheme(o.value)}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            theme === o.value
              ? "bg-primary text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}
