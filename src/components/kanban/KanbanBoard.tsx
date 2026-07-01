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
import type { KanbanTaskStatus as ColumnType, Order } from "@/types/kanban";

const COLUMN_LABELS: Record<ColumnType, string> = {
  PENDENTE: "A Fazer",
  FAZENDO: "Em Andamento",
  FINALIZADO: "Concluído",
};

const COLUMNS = Object.entries(COLUMN_LABELS) as [ColumnType, string][];

interface KanbanBoardProps {
  orders: Order[];
  onMoveOrder: (orderId: number, targetColumn: ColumnType) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: number) => void;
  isManager: boolean;
}

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
    const map = COLUMNS.reduce((acc, [key]) => {
      acc[key] = [];
      return acc;
    }, {} as Record<ColumnType, Order[]>);

    orders?.forEach((o) => {
      if (map[o.section]) map[o.section].push(o);
    });
    
    return map;
  }, [orders]);

  function handleDragStart(e: DragStartEvent) {
    const orderId = Number(e.active.id);
    const order = orders?.find((o) => Number(o.id) === orderId) || null;
    setOrderBeingMoved(order);
  }

  function handleDragEnd(e: DragEndEvent) {
    setOrderBeingMoved(null);

    const orderId = Number(e.active.id);
    const target = e.over?.id as ColumnType | undefined;

    if (!target) return;

    const original = orders?.find((o) => Number(o.id) === orderId);
    if (!original || original.section === target) return;

    onMoveOrder(orderId, target);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-background mx-8 flex h-full min-h-[calc(100vh-195px)] snap-x snap-mandatory items-stretch 
      overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:grid-rows-1 lg:gap-3">
        {COLUMNS.map(([id, title]) => (
          <div
            key={id}
            className="h-full w-full shrink-0 snap-center px-4 lg:w-auto lg:px-0"
          >
            <KanbanColumn
              id={id}
              title={title}
              orders={byColumn[id]}
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
