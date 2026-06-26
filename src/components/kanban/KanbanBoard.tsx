import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from ".";
import { KanbanCard } from ".";
import type { KanbanColumnNames as ColumnType, Order } from "@/types/kanban";

interface KanbanBoardProps {
  orders: Order[];
  onMoveOrder: (orderId: string, targetColumn: ColumnType) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  isManager: boolean;
}

const COLUMNS: { id: ColumnType; title: string }[] = [
  { id: "TODO", title: "A Fazer" },
  { id: "DOING", title: "Fazendo" },
  { id: "DONE", title: "Concluído" },
];

export function KanbanBoard({
  orders,
  onMoveOrder,
  onEditOrder,
  onDeleteOrder,
  isManager,
}: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );
  const [orderBeingMoved, setOrderBeingMoved] = useState<Order | null>(null);

  const byColumn = useMemo(() => {
    const map: Record<ColumnType, Order[]> = { TODO: [], DOING: [], DONE: [] };
    orders?.forEach((o) => {
      if (map[o.column]) map[o.column].push(o);
    });
    return map;
  }, [orders]);

  function handleDragStart(e: DragStartEvent) {
    const orderId = String(e.active.id);
    const order = orders?.find((o) => o.id === orderId) || null;
    setOrderBeingMoved(order);
  }

  function handleDragEnd(e: DragEndEvent) {
    setOrderBeingMoved(null);

    const orderId = String(e.active.id);
    const target = e.over?.id as ColumnType | undefined;

    if (!target) return;

    const original = orders?.find((o) => o.id === orderId);
    if (!original || original.column === target) return;

    onMoveOrder(orderId, target);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-background mx-8 flex h-full min-h-[calc(100vh-195px)] snap-x snap-mandatory items-stretch overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:grid-rows-1 lg:gap-3">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className="h-full w-full shrink-0 snap-center px-4 lg:w-auto lg:px-0"
          >
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              orders={byColumn[column.id]}
              onEdit={onEditOrder}
              onDelete={onDeleteOrder}
              isManager={isManager}
            />
          </div>
        ))}

        <DragOverlay>
          {orderBeingMoved ? (
            <KanbanCard
              order={orderBeingMoved}
              onEdit={() => {}}
              onDelete={() => {}}
              isManager={isManager}
              isOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
