import {
  Calculator,
  ClipboardList,
  FileBarChart,
  Home,
  LayoutDashboard,
  SquareKanban,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/schemas/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /**
   * Authorized roles.
   * Absent = visible to all authenticated users.
   */
  roles?: UserRole[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Opera\u00e7\u00e3o",
    items: [
      { label: "In\u00edcio", href: "/inicio", icon: Home },
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Kanban", href: "/kanban", icon: SquareKanban },
      { label: "Pedidos", href: "/pedidos", icon: ClipboardList },
    ],
  },
  {
    title: "Gest\u00e3o",
    items: [
      {
        label: "Calculadora",
        href: "/calculadora",
        icon: Calculator,
        roles: ["GERENTE"],
      },
      {
        label: "Registrar usu\u00e1rio",
        href: "/auth/register",
        icon: UserPlus,
        roles: ["GERENTE"],
      },
      {
        label: "Relat\u00f3rios",
        href: "/relatorios",
        icon: FileBarChart,
        roles: ["GERENTE"],
      },
    ],
  },
];

const TAB_ITEMS: NavItem[] = [
  { label: "In\u00edcio", href: "/inicio", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kanban", href: "/kanban", icon: SquareKanban },
  { label: "Pedidos", href: "/pedidos", icon: ClipboardList },
  {
    label: "Calculadora",
    href: "/calculadora",
    icon: Calculator,
    roles: ["GERENTE"],
  },
  {
    label: "Relat\u00f3rios",
    href: "/relatorios",
    icon: FileBarChart,
    roles: ["GERENTE"],
  },
];

export function getVisibleTabItems(role: UserRole | undefined): NavItem[] {
  return TAB_ITEMS.filter(
    (item) => !item.roles || (role !== undefined && item.roles.includes(role)),
  );
}

export const ROLE_LABELS: Record<UserRole, string> = {
  GERENTE: "Gerente",
  OPERACIONAL: "Operacional",
};

export function getVisibleSections(role: UserRole | undefined): NavSection[] {
  return NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.roles || (role !== undefined && item.roles.includes(role)),
    ),
  })).filter((section) => section.items.length > 0);
}

export function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string): string {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (isItemActive(pathname, item.href)) return item.label;
    }
  }
  return "K3D";
}

export function getInitials(name?: string, email?: string): string {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";

  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

