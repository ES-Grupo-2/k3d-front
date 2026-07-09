"use client";

import { useState } from "react";

import type { AuthUser } from "@/schemas/auth";
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

export function AppShell({ user, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full">
      <aside className="border-border bg-card fixed inset-y-0 left-0 z-40 hidden w-64 border-r md:block">
        <SidebarContent user={user} />
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

      <div className="flex min-h-screen flex-col md:pl-64">
        <Navbar user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 pb-28 md:p-8 md:pb-8">{children}</main>
      </div>

      <MobileTabBar user={user} />
    </div>
  );
}
