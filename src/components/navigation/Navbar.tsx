"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";

import { getPageTitle } from "./nav-config";

interface NavbarProps {
  onMenuClick: () => void;
  // Controle do modo compacto da sidebar (só desktop).
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Navbar({ onMenuClick, collapsed, onToggleCollapse }: NavbarProps) {
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

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className="text-foreground/80 hover:bg-primary/10 hover:text-foreground hidden size-10 items-center justify-center rounded-lg transition-colors hover:cursor-pointer md:inline-flex"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </button>
      )}

      <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>

      {/* Slot para ações específicas da página (ex: "Novo pedido" no Kanban). */}
      <div id="header-slot" className="flex items-center gap-2" />
    </header>
  );
}
