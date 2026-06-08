import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from ".";
import type { KanbanColumnNames as ColumnType, Order } from "@/types/kanban";

interface KanbanColumnProps {
  id: ColumnType;
  title: string;
  orders: Order[];
  onEdit: (o: Order) => void;
  onDelete: (id: string) => void;
  isManager: boolean;
}

export function KanbanColumn({ id, title, orders, onEdit, onDelete, isManager }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  
  return (
    <div
      ref={setNodeRef}
      className={`panel flex flex-col min-h-0 ${isOver ? "ring-2 ring-primary" : ""}`}
    >
      <header className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted">{title}</h2>
        <span className="text-xs text-subtle">{orders.length}</span>
      </header>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {orders.map((o) => (
          <KanbanCard
            key={o.id}
            order={o}
            onEdit={() => onEdit(o)}
            onDelete={() => onDelete(o.id)}
            isManager={isManager}
          />
        ))}
        {orders.length === 0 && (
          <p className="text-xs text-subtle text-center py-6">Sem pedidos aqui</p>
        )}
      </div>
    </div>
  );
}