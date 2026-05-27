'use client';

import { useMemo } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { KanbanColumn } from "./kanbanColumn";
import type { KanbanColumnNames as ColumnType, Order } from "@/types/kanban";

// Estes dados viriam do TanStack Query via algum componente superior ou hook msm
interface KanbanBoardProps {
  orders: Order[];
  onMoveOrder: (orderId: string, targetColumn: ColumnType) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  canDelete: boolean;
}

const COLUMNS: { id: ColumnType; title: string }[] = [
  { id: "TODO", title: "A Fazer" },
  { id: "DOING", title: "Fazendo" },
  { id: "DONE", title: "Concluído" },
];

export default function KanbanBoard({ orders, onMoveOrder, onEditOrder, onDeleteOrder, canDelete }: KanbanBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const byColumn = useMemo(() => {
    const map: Record<ColumnType, Order[]> = { TODO: [], DOING: [], DONE: [] };
    orders?.forEach((o) => {
        if(map[o.column]) map[o.column].push(o);
    });
    return map;
  }, [orders]);

  function onDrop(e: DragEndEvent) {
    const orderId = String(e.active.id);
    const target = e.over?.id as ColumnType | undefined;
    
    if (!target) return;
    
    const original = orders?.find((o) => o.id === orderId);
    if (!original || original.column === target) return;
    
    onMoveOrder(orderId, target);
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDrop}>
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            orders={byColumn[column.id]}
            onEdit={onEditOrder}
            onDelete={onDeleteOrder}
            canDelete={canDelete}
          />
        ))}
      </div>
    </DndContext>
  );
}