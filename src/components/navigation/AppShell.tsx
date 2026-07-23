"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

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
import { Navbar } from "./Navbar";
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

  const expandSidebar = () => {
    setCollapsed(false);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, "false");
  };

  return (
    // Desktop: backdrop + painéis flutuantes (altura fixa, scroll interno no
    // conteúdo). Mobile: comportamento anterior (fundo normal, scroll do documento).
    <div className="bg-background md:bg-backdrop min-h-screen w-full md:flex md:h-screen md:gap-3 md:overflow-hidden md:p-3">
      {/* Sidebar — faz parte do backdrop (sem painel próprio): itens direto sobre
          o fundo, só o conteúdo é o painel flutuante. */}
      <aside
        className={cn(
          "hidden shrink-0 transition-[width] duration-200 md:block",
          collapsed ? "md:w-16" : "md:w-64",
        )}
      >
        <SidebarContent
          user={user}
          collapsed={collapsed}
          onExpand={expandSidebar}
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

      {/* Conteúdo — único painel flutuante, sobre o backdrop. */}
      <div
        className={cn(
          "flex min-h-screen flex-col",
          "md:min-h-0 md:min-w-0 md:flex-1 md:overflow-hidden md:rounded-3xl md:bg-background md:shadow-2xl",
        )}
      >
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
        <main className="flex-1 p-4 pb-28 md:overflow-y-auto md:p-8 md:pb-8">
          {children}
        </main>
      </div>

      <MobileTabBar user={user} />
    </div>
  );
}
