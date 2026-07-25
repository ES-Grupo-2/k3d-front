/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import {
  Calculator,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  SquareKanban,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/schemas/auth";

export interface HomeShortcut {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Perfis autorizados. Ausente = visível para todo usuário autenticado. */
  roles?: UserRole[];
}

// Atalhos exibidos na tela inicial. A própria "Início" não entra aqui.
const HOME_SHORTCUTS: HomeShortcut[] = [
  {
    label: "Dashboard",
    description: "Visão geral e indicadores da operação.",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Kanban",
    description: "Acompanhe o fluxo de produção em tempo real.",
    href: "/kanban",
    icon: SquareKanban,
  },
  {
    label: "Pedidos",
    description: "Gerencie os pedidos da operação.",
    href: "/pedidos",
    icon: ClipboardList,
  },
  {
    label: "Tarcisio",
    description: "Indicadores e relatórios gerenciais.",
    href: "/relatorios",
    icon: FileBarChart,
    roles: ["GERENTE"],
  },
  {
    label: "Registrar usuário",
    description: "Cadastre novos usuários no sistema.",
    href: "/auth/register",
    icon: UserPlus,
    roles: ["GERENTE"],
  },
  {
    label: "Calculadora",
    description: "Ferramenta de cálculo auxiliar.",
    href: "/calculadora",
    icon: Calculator,
    roles: ["GERENTE"],
  }
];

/** Atalhos da tela inicial visíveis para o perfil informado. */
export function getVisibleShortcuts(role: UserRole | undefined): HomeShortcut[] {
  return HOME_SHORTCUTS.filter(
    (item) => !item.roles || (role !== undefined && item.roles.includes(role)),
  );
}
