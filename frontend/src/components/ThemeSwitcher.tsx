import { useTheme, type Theme } from "../context/ThemeContext";

const OPTIONS: { value: Theme; title: string; icon: string }[] = [
  { value: "light", title: "Tema claro", icon: "☀" },
  { value: "dark", title: "Tema escuro", icon: "☾" },
  { value: "system", title: "Seguir sistema", icon: "⎚" },
];

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
