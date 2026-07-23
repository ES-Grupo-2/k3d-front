"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import type { AuthUser } from "@/schemas/auth";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui";

import { MobileTabBar } from "./MobileTabBar";
import { SidebarContent } from "./Sidebar";

interface AppShellProps {
  user: AuthUser;
  children: React.ReactNode;
}

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export function AppShell({ user, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // Modo compacto da sidebar (só desktop), persistido entre sessões.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Deferido para não chamar setState de forma síncrona no efeito.
    const timer = setTimeout(() => {
      if (localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true") {
        setCollapsed(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    // Painéis flutuantes sobre o backdrop (mobile e desktop): altura fixa da
    // viewport, scroll interno no conteúdo. No desktop a sidebar é fixa (parte
    // do backdrop); no mobile é um Sheet, aberto pelo botão da barra superior.
    <div className="bg-backdrop flex h-svh w-full gap-2 overflow-hidden p-2 md:gap-3 md:p-3">
      {/* Sidebar desktop — faz parte do backdrop (sem painel próprio). */}
      <aside
        className={cn(
          "hidden shrink-0 transition-[width] duration-200 md:block",
          collapsed ? "md:w-16" : "md:w-64",
        )}
      >
        <SidebarContent
          user={user}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <SheetDescription className="sr-only">
            Navegue entre os módulos da aplicação.
          </SheetDescription>
          <SidebarContent user={user} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Conteúdo — painel flutuante arredondado. */}
      <div className="bg-background flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl shadow-2xl">
        {/* Barra mobile: botão de menu (abre a sidebar em Sheet). */}
        <div className="flex h-14 shrink-0 items-center px-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            className="text-foreground/80 hover:bg-primary/10 inline-flex size-10 items-center justify-center rounded-lg transition-colors"
          >
            <Menu className="size-6" />
          </button>
        </div>
        <main className="flex-1 overflow-y-auto px-4 pb-28 md:p-8 md:pb-8">
          {children}
        </main>
      </div>

      <MobileTabBar user={user} />
    </div>
  );
}
