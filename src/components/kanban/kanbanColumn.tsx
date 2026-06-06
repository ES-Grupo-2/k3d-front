import { useDroppable, useDndContext } from "@dnd-kit/core";
import { KanbanCard } from "./kanbanCard";
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
  const { active } = useDndContext();
  const draggedOrder = active?.data.current?.order as Order | undefined
  const isCardFromOtherColumn = active?.data.current?.originColumn !== id 
  
  return (
    <div
      ref={setNodeRef}
      className={`panel flex flex-col h-full min-h-0 bg-background border-solid border-2 rounded-sm 
        ${isOver ? "border-primary" : ""}`}
    >
      <header className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-foreground">{title}</h2>
        <span className="text-xs text-subtle border-0 rounded-full px-3 py-1 bg-foreground/10">
          {orders.length}
        </span>
      </header>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {orders.map((o) => (
          <KanbanCard
            key={o.id}
            order={o}
            onEdit={() => onEdit(o)}
            onDelete={() => onDelete(o.id)}
            isManager={isManager}
          />
        ))}
        {isOver && isCardFromOtherColumn && draggedOrder &&(
          <KanbanCard
            order={draggedOrder}
            onEdit={() => {}} 
            onDelete={() => {}}
            isManager={isManager}
            isDestinationPlaceHolder={true} 
          />
        )}

        {orders.length === 0 && !(isOver && isCardFromOtherColumn) && (
          <p className="text-xs text-subtle text-center py-6">Sem pedidos aqui</p>
        )}
      </div>
    </div>
  );
}