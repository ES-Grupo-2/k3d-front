"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

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
}

export function SidebarContent({ user, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const sections = getVisibleSections(user.role);

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <span className="text-primary text-xl font-bold tracking-tight">K3D</span>
        <span className="text-muted-foreground text-xs">Gestão</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="text-muted-foreground px-3 pb-1 text-xs font-semibold tracking-wider uppercase">
              {section.title}
            </p>
            {section.items.map((item) => {
              const active = isItemActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/80 hover:bg-primary/10 hover:text-foreground",
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-border shrink-0 border-t p-4">
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
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
        <LogoutButton variant="full" className="w-full hover:cursor-pointer" onLoggedOut={onNavigate} />
      </div>
    </div>
  );
}
