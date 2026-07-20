import { useDraggable, useDndContext } from "@dnd-kit/core";
import { Order } from "@/types/kanban";
import { currency, humanizePayMethod, humanizePayStatus } from "@/lib/utils";
import { forwardRef } from "react";
import {CreditCard, Edit2, Trash, Package, User} from "lucide-react";

interface KanbanCardProps {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  isManager: boolean;
  isOverlay?: boolean;
  isDestinationPlaceHolder?: boolean;
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
    }: KanbanCardProps,
    ref,
  ) {
    const draggableId = isDestinationPlaceHolder
      ? `ghost-${order.id}`
      : order.id;
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: draggableId,
        data: { originColumn: order.section, order: order },
      });

    const { over } = useDndContext();

    const style =
      transform && isOverlay
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    const isOriginalCard = isDragging && !isOverlay;
    const isCardOverOtherColumn = over && over.id !== order.section;

    const isPlaceholder = isOriginalCard || isDestinationPlaceHolder;

    if (isOriginalCard && isCardOverOtherColumn) {
      return <div ref={setNodeRef} className="hidden" />;
    }

    const formattedTitle = order.title[0].toUpperCase() + order.title.slice(1);

    return (
      <div
        ref={isOverlay ? ref : setNodeRef}
        style={style}
        {...(isOverlay || isPlaceholder ? {} : listeners)}
        {...(isOverlay || isPlaceholder ? {} : attributes)}
        suppressHydrationWarning={true}
        className={`relative overflow-hidden rounded-md text-sm transition-colors ${
          isDragging ? "touch-none opacity-50" : "touch-pan-y"
        } ${
          isOverlay
            ? "bg-card border border-border ring-primary scale-105 rotate-3 cursor-grabbing opacity-90 shadow-2xl ring-2"
            : isPlaceholder
              ? "bg-border/20 border-border border-2 border-dashed opacity-50 cursor-grabbing"
              : "bg-card border border-border cursor-grab hover:bg-muted/40 shadow-sm active:cursor-grabbing"
        }`}
      >
        <div 
          className="absolute left-0 top-0 h-full w-1" 
          style={{ backgroundColor: order.tag?.color || '#777' }} 
        />

        <div className={`flex flex-col gap-3 p-4 pl-5 ${isPlaceholder ? "invisible" : "visible"}`}>
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold tracking-wider text-foreground/80 uppercase">
              {order.tag?.type}
            </span>
            
            {isManager && (
              <div className="flex items-center gap-1 opacity-60 transition-opacity hover:opacity-100">
                <button
                  className="rounded p-1 text-muted-foreground hover:cursor-pointer hover:bg-foreground/10 hover:text-foreground transition-all"
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                >
                  <Edit2 size={16} /> 
                </button>
                <button
                  className="rounded p-1 text-muted-foreground hover:cursor-pointer hover:bg-red-500/10 hover:text-red-400 transition-all"
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                  <Trash size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-medium leading-tight text-foreground">
              {formattedTitle}
            </h3>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User size={14} className="shrink-0" />
              <span className="truncate">{order.client?.name}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Package size={14} />
                <span>{order.quantity || 1} un</span>
              </div>
              <div className="font-medium text-foreground/90">
                {currency(order.price)}
              </div>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CreditCard size={14} />
              <span>{humanizePayMethod(order.payment_method || "None")}</span>
            </div>
            
            <span className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wide ${
              order.amount_paid >= order.price 
                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500"
            }`}>
              {humanizePayStatus(order.amount_paid || 0, order.price)}
            </span>
          </div>
        </div>
      </div>
    );
  },
);

KanbanCard.displayName = "KanbanCard";