/**
 * @file Alternador visual de tema no estilo EyePleasure. Três botões
 * quadrados (☀ claro / ☾ escuro / ⎚ sistema) com hover, estado ativo
 * destacando borda primária.
 * @author lukasnascimento1
 */
import { useTheme, type Theme } from "../context/ThemeContext";

type Option = { value: Theme; title: string; icon: JSX.Element };

const SUN = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MOON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MONITOR = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const OPTIONS: Option[] = [
  { value: "light", title: "Tema claro", icon: SUN },
  { value: "dark", title: "Tema escuro", icon: MOON },
  { value: "system", title: "Seguir sistema", icon: MONITOR },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1.5">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          aria-label={o.title}
          onClick={() => setTheme(o.value)}
          className={`ep-theme-toggle ${theme === o.value ? "active" : ""}`}
        >
          <span className="w-4 h-4 inline-flex">{o.icon}</span>
        </button>
      ))}
    </div>
  );
}
