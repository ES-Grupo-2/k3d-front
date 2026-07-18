import { useMemo, useState, useRef } from "react";
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
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 10 },
    }),
  );
  const [orderBeingMoved, setOrderBeingMoved] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<ColumnType>("TODO");
  const boardContainerRef = useRef<HTMLDivElement>(null);

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

  /**
   * Sync the active tab with the scroll position of the board container.
   * @returns 
   */
  function handleScroll() {
    if (!boardContainerRef.current || window.innerWidth >= 1024) return;
    
    const scrollLeft = boardContainerRef.current.scrollLeft;
    const width = boardContainerRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    
    if (COLUMNS[index]) {
      setActiveTab(COLUMNS[index].id);
    }
  };

  /**
   * When the user clicks on a tab, scroll the board container to the corresponding column.
   * @param columnId 
   * @param index 
   * @returns 
   */
  function scrollToColumn(columnId: ColumnType, index: number) {
    setActiveTab(columnId);
    if (!boardContainerRef.current) return;

    const width = boardContainerRef.current.clientWidth;
    boardContainerRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
  };

return (
  <DndContext 
  sensors={sensors} 
  onDragStart={handleDragStart} 
  onDragEnd={handleDragEnd}
  autoScroll={{ threshold: {x: 0.12, y: 0}, acceleration: 10, interval: 10 }}
  >

    <div className="flex flex-1 flex-col gap-2 overflow-hidden h-full w-full">
        {/* Fixed because we're considering that will only be three main columns */}
        <div className={`flex md:hidden shrink-0 justify-center overflow-x-hidden border-b border-border px-4 bg-background`}>
          {COLUMNS.map((column, index) => (
            <button
              key={column.id}
              type="button"
              onClick={() => scrollToColumn(column.id, index)}
              className={`flex shrink-0 items-center border-b-2 gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === column.id
                  ? "border-primary bg-muted text-foreground"
                  : "border-transparent bg-background text-muted-foreground"
              }`}
            >
              {column.title}
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs">
                {byColumn[column.id].length}
              </span>
            </button>
          ))}
        </div>

        <div
          ref={boardContainerRef}
          onScroll={handleScroll}
          className={`flex flex-1 h-full w-full min-h-0 overflow-x-auto overflow-y-hidden pb-4 pt-2 scroll-smooth select-none 
                      scrollbar-none lg:grid lg:grid-cols-3 lg:gap-3 lg:px-8 lg:pb-4 lg:overflow-x-visible lg:snap-none
                     ${orderBeingMoved ? 'snap-none' : 'snap-x snap-mandatory'}`}
        >
          {COLUMNS.map((column) => (
            <div
              key={column.id}
              className="w-full shrink-0 snap-center px-4 h-full min-h-0 flex flex-col 
                         lg:w-auto lg:shrink lg:snap-none lg:px-0"
            >
              <KanbanColumn
                id={column.id}
                title={column.title}
                orders={byColumn[column.id]}
                onEdit={onEditOrder}
                onDelete={onDeleteOrder}
                isManager={isManager}
              />
            </div>
          ))}

          <DragOverlay dropAnimation={null}>
            {orderBeingMoved ? (
              <KanbanCard
                order={orderBeingMoved}
                onEdit={() => {}}
                onDelete={() => {}}
                isManager={isManager}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </div>
      </div>
    </DndContext>
  );
}
