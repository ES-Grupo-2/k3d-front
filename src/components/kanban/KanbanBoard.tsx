import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
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
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 15 },
    }),
  );
  const [orderBeingMoved, setOrderBeingMoved] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<ColumnType>("TODO");

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
  <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

    <div className="flex flex-1 flex-col overflow-hidden h-full w-full">
      
      <div className="flex shrink-0 overflow-x-auto border-b border-border px-4 lg:hidden">
        {COLUMNS.map((column) => (
          <button
            key={column.id}
            onClick={() => setActiveTab(column.id)}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === column.id
                ? "border-primary text-foreground"
                : "border-transparent text-subtle hover:text-foreground"
            }`}
          >
            {column.title}
            <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs">
              {byColumn[column.id].length}
            </span>
          </button>
        ))}
      </div>

      <div className="mx-4 mt-2 flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:mx-8 lg:mt-0 lg:grid lg:grid-cols-3 lg:gap-3 lg:pb-4">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className={`h-full min-h-0 flex-col lg:flex ${
              activeTab === column.id ? "flex flex-1" : "hidden lg:flex"
            }`}
          >
            <KanbanColumn
              id={column.id}
              title={column.title}
              orders={byColumn[column.id]}
              onEdit={onEditOrder}
              onDelete={onDeleteOrder}
              onMoveOrder={onMoveOrder}
              isManager={isManager}
              allColumns={COLUMNS}
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
              isOverlay
              onMoveOrder={onMoveOrder}
              allColumns={COLUMNS}
            />
          ) : null}
        </DragOverlay>
      </div>
    </div>
  </DndContext>
);
}
