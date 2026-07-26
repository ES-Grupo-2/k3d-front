"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Provider de tema claro/escuro do app. Envolve o `next-themes`, que aplica a
 * classe `.dark` no <html>, persiste a escolha em localStorage e injeta o
 * script anti-flash no <head> — sem ele a página pisca no tema errado a cada
 * carregamento, já que o tema só seria conhecido depois da hidratação.
 *
 * Author: lukasnascimento1
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
