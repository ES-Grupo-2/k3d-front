"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import type { AuthUser } from "@/schemas/auth";
import { ThemeToggle } from "@/components/theme";

import { LogoutButton } from "./LogoutButton";
import { getInitials, getPageTitle, ROLE_LABELS } from "./nav-config";

interface NavbarProps {
  user: AuthUser;
  onMenuClick: () => void;
}

export function Navbar({ user, onMenuClick }: NavbarProps) {
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

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right">
            <p className="text-sm leading-tight font-medium">
              {user.name || user.email}
            </p>
            <p className="text-muted-foreground text-xs leading-tight">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full text-sm font-semibold">
            {getInitials(user.name, user.email)}
          </span>
        </div>

        <ThemeToggle />

        <LogoutButton variant="icon" />
      </div>
    </header>
  );
}
