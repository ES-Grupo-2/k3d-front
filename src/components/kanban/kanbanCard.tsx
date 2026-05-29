import { useDraggable } from "@dnd-kit/core";
import { Order } from "@/types/kanban";
import { currency, humanizeEnum } from "@/lib/utils";
import { forwardRef } from "react";

interface KanbanCardProps {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  isManager: boolean;
}

export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(function KanbanCard({ order, onEdit, onDelete, isManager }: KanbanCardProps, ref) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
  });
  
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={ setNodeRef}
      style={style}
      {...listeners} 
      {...attributes}
      className={`bg-background border border-border rounded-md text-sm overflow-hidden`}
    >
      <div
        className="px-3 py-2 flex items-center justify-between border-b border-border"
        style={{ borderLeft: `3px solid ${order.tag.color}` }}
      >
        <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
          {order.tag.name}
        </span>
        {isManager && (
        <div className="flex items-center gap-1">
            <button
              className="text-xs text-subtle hover:text-foreground px-1 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
            >
              ✎
          </button>
            <button
              className="text-xs text-subtle hover:text-danger px-1 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
              ✕
            </button>
        </div>)}
      </div>

      <div className="px-3 py-2 cursor-grab" {...listeners} {...attributes}>
        <div className="font-medium leading-tight text-foreground">{order.title}</div>
        <div className="text-xs text-muted mt-1">{order.client.name}</div>
        <div className="text-[11px] text-subtle mt-1">
          Qtde: {order.quantity} · {currency(order.price)}
        </div>
      </div>

      <div className="px-3 py-1.5 border-t border-border text-[10px] text-subtle flex justify-between">
        <span>{humanizeEnum(order.status)}</span>
        <span>{humanizeEnum(order.paymentMethod)}</span>
      </div>
    </div>
);
});

KanbanCard.displayName = "KanbanCard";