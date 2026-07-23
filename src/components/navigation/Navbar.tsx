"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { getPageTitle } from "./nav-config";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="bg-background/80 border-border sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b px-4 backdrop-blur md:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="text-foreground/80 hover:bg-primary/10 inline-flex size-10 items-center justify-center rounded-lg transition-colors md:hidden"
      >
        <Menu className="size-6" />
      </button>

      <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>

      {/* Slot para ações específicas da página (ex: "Novo pedido" no Kanban). */}
      <div id="header-slot" className="flex items-center gap-2" />
    </header>
  );
}
