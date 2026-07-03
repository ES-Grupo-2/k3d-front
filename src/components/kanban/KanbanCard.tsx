import { useDraggable, useDndContext } from "@dnd-kit/core";
import { KanbanColumnNames as ColumnType, Order } from "@/types/kanban";
import { currency, humanizeEnum } from "@/lib/utils";
import { forwardRef } from "react";

interface KanbanCardProps {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  isManager: boolean;
  isOverlay?: boolean;
  isDestinationPlaceHolder?: boolean;
  onMoveOrder: (orderId: string, targetColumn: ColumnType) => void;
  allColumns: { id: ColumnType; title: string }[];
}

export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(
  function KanbanCard(
    {
      order,
      onEdit,
      onDelete,
      isManager,
      isOverlay,
      isDestinationPlaceHolder,
      onMoveOrder,
      allColumns,
    }: KanbanCardProps,
    ref,
  ) {
    const draggableId = isDestinationPlaceHolder
      ? `ghost-${order.id}`
      : order.id;
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: draggableId,
        data: { originColumn: order.column, order: order },
      });

    const { over } = useDndContext();

    const style =
      transform && isOverlay
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    const isOriginalCard = isDragging && !isOverlay;
    const isCardOverOtherColumn = over && over.id !== order.column;

    const isPlaceholder = isOriginalCard || isDestinationPlaceHolder;

    const columnIndex = allColumns?.findIndex((c) => c.id === order.column) ?? -1;
    const prevColumn = columnIndex > 0 ? allColumns[columnIndex - 1] : null;
    const nextColumn = columnIndex !== -1 && columnIndex < allColumns.length - 1 ? allColumns[columnIndex + 1] : null;

    if (isOriginalCard && isCardOverOtherColumn) {
      return <div ref={setNodeRef} className="hidden" />;
    }

    return (
      <div
        ref={isOverlay ? ref : setNodeRef}
        style={style}
        {...(isOverlay || isPlaceholder ? {} : listeners)}
        {...(isOverlay || isPlaceholder ? {} : attributes)}
        suppressHydrationWarning={true}
        className={`overflow-hidden rounded-md text-sm ${
          isDragging ? "touch-none opacity-50" : "touch-pan-y"
        } ${
          isOverlay
            ? "bg-background border-border ring-primary scale-105 rotate-3 cursor-grabbing border opacity-90 shadow-2xl ring-2"
            : isPlaceholder
              ? "bg-border/40 border-border border-2 border-dashed opacity-50"
              : "bg-background border-border cursor-grab border shadow-sm active:cursor-grabbing"
        }`}
      >
        <div className={isPlaceholder ? "invisible" : "visible"}>
          
          <div
            className="border-border relative flex items-center justify-between border-b px-3 py-2"
            style={{ borderLeft: `3px solid ${order.tag.color}` }}
          >
            <span className="text-muted text-[10px] font-medium tracking-wider uppercase pr-[120px] truncate">
              {order.tag.name}
            </span>
            <div className="absolute right-[60px] top-[16.25px] -translate-y-1/2 flex items-center gap-1 lg:hidden">
              {prevColumn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveOrder(order.id, prevColumn.id);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded bg-foreground/10 text-subtle text-xs font-bold hover:bg-foreground/20 active:bg-foreground/30 transition-colors"
                  title={`Voltar para ${prevColumn.title}`}
                >
                  ←
                </button>
              )}

              {nextColumn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveOrder(order.id, nextColumn.id);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded bg-foreground/10 text-subtle text-xs font-bold hover:bg-foreground/20 active:bg-foreground/30 transition-colors"
                  title={`Avançar para ${nextColumn.title}`}
                >
                  →
                </button>
              )}
            </div>

            {isManager && (
              <div className="flex items-center gap-1">
                <button
                  className="text-subtle hover:bg-foreground/15 cursor-pointer rounded-full px-1 text-xs transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  ✎
                </button>
                <button
                  className="text-subtle cursor-pointer px-1 text-xs hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="cursor-grab px-3 py-2">
            <div className="text-foreground leading-tight font-medium">
              {order.title}
            </div>
            <div className="text-muted mt-1 text-xs">{order.client.name}</div>
            <div className="text-subtle mt-1 text-[11px]">
              Qtde: {order.quantity} · {currency(order.price)}
            </div>
          </div>

          <div className="border-border text-subtle flex justify-between border-t px-3 py-1.5 text-[10px]">
            <span>{humanizeEnum(order.status)}</span>
            <span>{humanizeEnum(order.paymentMethod)}</span>
          </div>
        </div>
      </div>
    );
  },
);

KanbanCard.displayName = "KanbanCard";