import {
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
  /** Perfis autorizados. Ausente = visível para todo usuário autenticado. */
  roles?: UserRole[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Operação",
    items: [
      { label: "Início", href: "/inicio", icon: Home },
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Kanban", href: "/kanban", icon: SquareKanban },
      { label: "Pedidos", href: "/pedidos", icon: ClipboardList },
    ],
  },
  {
    title: "Gestão",
    items: [
      {
        label: "Registrar usuário",
        href: "/auth/register",
        icon: UserPlus,
        roles: ["GERENTE"],
      },
      {
        label: "Relatórios",
        href: "/relatorios",
        icon: FileBarChart,
        roles: ["GERENTE"],
      },
    ],
  },
];

// Itens principais expostos na tab bar mobile (subconjunto das rotas).
const TAB_ITEMS: NavItem[] = [
  { label: "Início", href: "/inicio", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kanban", href: "/kanban", icon: SquareKanban },
  { label: "Pedidos", href: "/pedidos", icon: ClipboardList },
  { label: "Relatórios", href: "/relatorios", icon: FileBarChart, roles: ["GERENTE"] },
];

/** Itens da tab bar mobile visíveis para o perfil informado. */
export function getVisibleTabItems(role: UserRole | undefined): NavItem[] {
  return TAB_ITEMS.filter(
    (item) => !item.roles || (role !== undefined && item.roles.includes(role)),
  );
}

export const ROLE_LABELS: Record<UserRole, string> = {
  GERENTE: "Gerente",
  OPERACIONAL: "Operacional",
};

/** Retorna apenas as seções/itens que o perfil informado pode visualizar. */
export function getVisibleSections(role: UserRole | undefined): NavSection[] {
  return NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.roles || (role !== undefined && item.roles.includes(role)),
    ),
  })).filter((section) => section.items.length > 0);
}

/** Item ativo: rota exata ou uma sub-rota (ex.: /pedidos/123 ativa /pedidos). */
export function isItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Título da página atual, derivado do menu (fallback genérico). */
export function getPageTitle(pathname: string): string {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (isItemActive(pathname, item.href)) return item.label;
    }
  }
  return "K3D";
}

/** Iniciais para o avatar do usuário. */
export function getInitials(name?: string, email?: string): string {
  const source = name?.trim() || email?.trim() || "";
  if (!source) return "?";

  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}
