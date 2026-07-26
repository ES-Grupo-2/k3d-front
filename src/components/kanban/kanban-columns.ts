/**
 * @author lukasnascimento1
 */

// Ícone de status de cada coluna do Kanban, exibido ao lado do nome (abas no
// mobile e headers das colunas no desktop).

import { Circle, CircleCheck, Timer, type LucideIcon } from "lucide-react";

import type { KanbanTaskStatus } from "@/types/kanban";

export const COLUMN_ICONS: Record<KanbanTaskStatus, LucideIcon> = {
  PENDENTE: Circle,
  FAZENDO: Timer,
  FINALIZADO: CircleCheck,
};
