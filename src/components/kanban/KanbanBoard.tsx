/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import { useMemo, useState, useRef } from "react";
import {
  DndContext,
  pointerWithin,
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
import type { KanbanTaskStatus as ColumnType, Order } from "@/types/kanban";
import { COLUMN_ICONS } from "./kanban-columns";
import { snapCenterToCursor } from "@dnd-kit/modifiers";


const COLUMN_LABELS: Record<ColumnType, string> = {
  PENDENTE: "A Fazer",
  FAZENDO: "Em Andamento",
  FINALIZADO: "Concluído",
};

const COLUMNS = Object.entries(COLUMN_LABELS).map(([id, title]) => ({
  id: id as ColumnType,
  title,
}));

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
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 10 },
    }),
  );
  const [orderBeingMoved, setOrderBeingMoved] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<ColumnType>("PENDENTE");
  const boardContainerRef = useRef<HTMLDivElement>(null);

  const byColumn = useMemo(() => {
    const map = COLUMNS.reduce((acc, column) => {
      acc[column.id] = [];
      return acc;
    }, {} as Record<ColumnType, Order[]>);

    orders?.forEach((o) => {
      if (map[o.section]) map[o.section].push(o);
    });

    // Sorting the most recent orders and limiting the quantity of cards displayed in DONE column
    if (map["FINALIZADO"]) {
      map["FINALIZADO"] = map["FINALIZADO"]
        .sort((a, b) => {
          const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return dateB - dateA; 
        })
        .slice(0, 20);
      }

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
  collisionDetection={pointerWithin}
  onDragStart={handleDragStart} 
  onDragEnd={handleDragEnd}
  autoScroll={{ threshold: {x: 0.12, y: 0}, acceleration: 10, interval: 10 }}
  >

    <div className="flex flex-1 flex-col gap-2 overflow-hidden h-full w-full">
        {/* Fixed because we're considering that will only be three main columns */}
        <div className={`flex md:hidden shrink-0 border-b border-border px-2 bg-background`}>
          {COLUMNS.map((column, index) => {
            const Icon = COLUMN_ICONS[column.id];
            return (
              <button
                key={column.id}
                type="button"
                onClick={() => scrollToColumn(column.id, index)}
                className={`flex min-w-0 flex-1 items-center justify-center border-b-2 gap-1.5 px-2 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === column.id
                    ? "border-primary bg-muted text-foreground"
                    : "border-transparent bg-background text-muted-foreground"
                }`}
              >
                {/* O ícone só entra quando há folga; abaixo de 640px o rótulo tem prioridade. */}
                <Icon className="hidden sm:block size-4 shrink-0" />
                <span className="truncate">{column.title}</span>
                <span className="shrink-0 rounded-full bg-foreground/10 px-1.5 py-0.5 text-[11px]">
                  {byColumn[column.id].length}
                </span>
              </button>
            );
          })}
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

          <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
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
