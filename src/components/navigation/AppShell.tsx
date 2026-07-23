"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useEffect, useState } from "react";

import type { AuthUser } from "@/schemas/auth";
import { cn } from "@/lib/utils";

import { MobileTabBar } from "./MobileTabBar";
import { SidebarContent } from "./Sidebar";
import { MobileNavProvider } from "./mobile-nav";

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
    // Painéis flutuantes sobre o backdrop, mobile e desktop: altura fixa da
    // viewport, scroll interno no conteúdo. No desktop a sidebar é fixa (parte
    // do backdrop); no mobile ela é um drawer que EMPURRA o conteúdo ao abrir.
    <MobileNavProvider value={{ openMenu: () => setMobileOpen(true) }}>
      <div className="bg-backdrop relative flex h-svh w-full overflow-hidden p-2 pb-20 md:gap-3 md:p-3">
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

        {/* Sidebar mobile — drawer com o mesmo design; desliza da esquerda e
            empurra o conteúdo para a direita. */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 p-2 pb-20 transition-transform duration-200 ease-out md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarContent user={user} onNavigate={() => setMobileOpen(false)} />
        </aside>

        {/* Scrim (mobile) — escurece o conteúdo e fecha ao tocar. */}
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/25 md:hidden"
          />
        ) : null}

        {/* Conteúdo — painel flutuante arredondado. */}
        <div
          className={cn(
            "bg-background relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl shadow-2xl transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-64 md:translate-x-0" : "translate-x-0",
          )}
        >
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </div>

        <MobileTabBar user={user} />
      </div>
    </MobileNavProvider>
  );
}
