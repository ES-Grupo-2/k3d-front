"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AuthUser } from "@/schemas/auth";
import { cn } from "@/lib/utils";

import { getVisibleTabItems, isItemActive } from "./nav-config";

interface MobileTabBarProps {
  user: AuthUser;
}

/**
 * Tab bar mobile no estilo Liquid Glass do EyePleasure: pill flutuante de
 * vidro (blur + borda branca sutil + sombra) com uma "bolha" translúcida que
 * desliza com spring entre os ícones. Só ícones (estilo Instagram); o ícone
 * ativo recebe a cor da marca K3D. Visível apenas no mobile — no desktop a
 * navegação fica na sidebar fixa.
 */
export function MobileTabBar({ user }: MobileTabBarProps) {
  const pathname = usePathname();
  const items = getVisibleTabItems(user.role);

  if (items.length === 0) return null;

  const activeIndex = items.findIndex((item) => isItemActive(pathname, item.href));
  const slotWidth = 100 / items.length;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.6rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <div className="bg-card/70 relative flex w-full max-w-md items-center rounded-full border border-white/10 p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {/* Bolha deslizante (marcador do item ativo) */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-1.5 left-0 rounded-full bg-white/15 transition-[transform,opacity] duration-[420ms]",
            "ease-[cubic-bezier(0.34,1.4,0.64,1)]",
            activeIndex < 0 && "opacity-0",
          )}
          style={{
            width: `${slotWidth}%`,
            transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
          }}
        />

        {items.map((item) => {
          const active = isItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className="relative z-10 flex flex-1 items-center justify-center py-2.5"
            >
              <Icon
                className={cn(
                  "size-6 transition-colors duration-200",
                  active ? "text-primary" : "text-foreground/55",
                )}
                strokeWidth={active ? 2.4 : 2}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
