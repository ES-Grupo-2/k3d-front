"use client";

/**
 * @author lukasnascimento1
 */

// Contexto + botão para abrir a sidebar mobile (Sheet) a partir da linha do
// título de cada tela. No desktop a sidebar é fixa, então o botão some (md:hidden).

import { createContext, useContext } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

const MobileNavContext = createContext<{ openMenu: () => void }>({
  openMenu: () => {},
});

export const MobileNavProvider = MobileNavContext.Provider;

export function MobileMenuButton({ className }: { className?: string }) {
  const { openMenu } = useContext(MobileNavContext);
  return (
    <button
      type="button"
      onClick={openMenu}
      aria-label="Abrir menu"
      className={cn(
        "text-foreground/80 hover:bg-primary/10 inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors md:hidden",
        className,
      )}
    >
      <Menu className="size-6" />
    </button>
  );
}
