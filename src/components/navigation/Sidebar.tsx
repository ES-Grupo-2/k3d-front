"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { AuthUser } from "@/schemas/auth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme";

import { LogoutButton } from "./LogoutButton";
import {
  getInitials,
  getVisibleSections,
  isItemActive,
  ROLE_LABELS,
} from "./nav-config";

interface SidebarContentProps {
  user: AuthUser;
  onNavigate?: () => void;
  // Modo compacto (só ícones) — usado apenas na sidebar fixa do desktop.
  // Toggle: chevron "<" ao lado da logo (expandido) e ">" (compacto); o avatar
  // de perfil também expande. Tudo via onToggleCollapse.
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SidebarContent({
  user,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: SidebarContentProps) {
  const pathname = usePathname();
  const sections = getVisibleSections(user.role);

  return (
    <div className="flex h-full flex-col">
      {/* Marca */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center",
          collapsed ? "justify-center px-2" : "gap-2 px-6",
        )}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Expandir menu"
            aria-label="Expandir menu"
            className="text-muted-foreground hover:text-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors hover:cursor-pointer"
          >
            <ChevronRight className="size-6" strokeWidth={1.5} />
          </button>
        ) : (
          <>
            <span className="text-foreground text-xl font-bold tracking-tight dark:text-primary">
              K3D
            </span>
            <span className="text-muted-foreground text-xs">Gestão</span>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Recolher menu"
                aria-label="Recolher menu"
                className="text-muted-foreground hover:text-foreground ml-auto inline-flex size-8 items-center justify-center rounded-md transition-colors hover:cursor-pointer"
              >
                <ChevronLeft className="size-6" strokeWidth={1.5} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Navegação */}
      <nav
        className={cn(
          "flex-1 space-y-6 overflow-y-auto py-4",
          collapsed ? "px-2" : "px-3",
        )}
      >
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <p className="text-muted-foreground px-3 pb-1 text-xs font-semibold tracking-wider uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const active = isItemActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-colors",
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/80 hover:bg-primary/10 hover:text-foreground",
                  )}
                >
                  <Icon className="size-6 shrink-0" />
                  {!collapsed && item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Rodapé */}
      <div
        className={cn(
          "shrink-0",
          collapsed ? "flex flex-col items-center gap-2 p-2" : "p-4",
        )}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            title="Perfil — expandir menu"
            aria-label="Expandir menu"
            className="hover:cursor-pointer"
          >
            <span className="bg-primary text-primary-foreground ring-foreground/15 flex size-9 items-center justify-center rounded-full text-sm font-semibold ring-1">
              {getInitials(user.name, user.email)}
            </span>
          </button>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-3">
              <span className="bg-primary text-primary-foreground ring-foreground/15 flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-1">
                {getInitials(user.name, user.email)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user.name || user.email}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {ROLE_LABELS[user.role]}
                </p>
              </div>
              <ThemeToggle className="shrink-0" />
            </div>

            <LogoutButton
              variant="full"
              className="bg-card w-full hover:cursor-pointer"
              onLoggedOut={onNavigate}
            />
          </>
        )}
      </div>
    </div>
  );
}
