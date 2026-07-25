"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AuthUser } from "@/schemas/auth";
import { cn } from "@/lib/utils";

import { getVisibleTabItems, isItemActive } from "./nav-config";

interface MobileTabBarProps {
  user: AuthUser;
}


/**
 * Mobile Tab Bar in the style of EyePleasure's Liquid Glass: a floating pill
 * (blur + subtle white border + shadow) with a translucent "bubble" that slides
 * with a spring between the icons. Icon-only (Instagram style); the active icon
 * receives the K3D brand color. Visible on mobile only — on desktop, navigation
 * is in the fixed sidebar.
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
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-1.5 left-0 rounded-full bg-white/15 transition-[transform,opacity] duration-420",
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
