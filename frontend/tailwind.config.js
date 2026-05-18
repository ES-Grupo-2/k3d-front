/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // Estratégia: light é o override via data-theme; dark é o padrão. Mantemos
  // `darkMode: 'class'` apenas para compat — não usamos `dark:` na app.
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Aliases curtos que mapeiam para os tokens --ep-*. Permite escrever
        // utilities Tailwind comuns (bg-surface, text-muted, etc.) sem ter
        // que lembrar dos prefixos --ep-.
        background: "var(--ep-bg)",
        "bg-elevated": "var(--ep-bg-elevated)",
        surface: "var(--ep-surface)",
        "surface-strong": "var(--ep-surface-strong)",
        "surface-hover": "var(--ep-surface-hover)",
        border: "var(--ep-border)",
        "border-strong": "var(--ep-border-strong)",
        "border-soft": "var(--ep-border-soft)",
        foreground: "var(--ep-text)",
        "fg-soft": "var(--ep-text-soft)",
        muted: "var(--ep-text-muted)",
        faint: "var(--ep-text-faint)",
        subtle: "var(--ep-text-dim)",
        label: "var(--ep-label)",
        primary: "var(--ep-primary)",
        "primary-soft": "var(--ep-primary-soft)",
        accent: "var(--ep-accent)",
        "accent-soft": "var(--ep-accent-soft)",
        success: "var(--ep-success)",
        "success-soft": "var(--ep-success-soft)",
        warning: "var(--ep-warning)",
        "warning-soft": "var(--ep-warning-soft)",
        error: "var(--ep-error)",
        "error-soft": "var(--ep-error-soft)",
        danger: "var(--ep-error)",
      },
      boxShadow: {
        soft: "var(--ep-shadow-soft)",
        elevated: "var(--ep-shadow-elevated)",
        card: "var(--ep-shadow-card)",
        "card-hover": "var(--ep-shadow-card-hover)",
      },
    },
  },
  plugins: [],
};
