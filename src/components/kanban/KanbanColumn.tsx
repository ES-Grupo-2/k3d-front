import { useDroppable, useDndContext } from "@dnd-kit/core";
import { KanbanCard } from ".";
import type { KanbanTaskStatus as ColumnType, Order } from "@/types/kanban";

interface KanbanColumnProps {
  id: ColumnType;
  title: string;
  orders: Order[];
  onEdit: (o: Order) => void;
  onDelete: (id: number) => void;
  isManager: boolean;
}

export function KanbanColumn({
  id,
  title,
  orders,
  onEdit,
  onDelete,
  isManager,
}: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const { active } = useDndContext();
  const draggedOrder = active?.data.current?.order as Order | undefined;
  const isCardFromOtherColumn = active?.data.current?.originColumn !== id;
  return (
  <div
    ref={setNodeRef}
    className={`panel flex flex-1 h-full min-h-0 w-full flex-col overflow-hidden rounded-sm border-2 border-solid transition-colors ${
        isOver ? "border-primary bg-primary/5" : "bg-muted border-border"
      }`}
  >
    <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
      <h2 className="text-foreground text-sm font-semibold tracking-wider uppercase">
        {title}
      </h2>
      <span className="text-subtle rounded-full bg-foreground/10 px-3 py-1 text-xs">
        {orders.length}
      </span>
    </header>

   
    <div className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="space-y-3 pb-4"> 
        {orders.map((o) => (
          <KanbanCard
            key={Number(o.id)}
            order={o}
            onEdit={() => onEdit(o)}
            onDelete={() => onDelete(Number(o.id))}
            isManager={isManager}
          />
        ))}

        {isOver && isCardFromOtherColumn && draggedOrder && (
          <KanbanCard
            order={draggedOrder}
            onEdit={() => {}}
            onDelete={() => {}}
            isManager={isManager}
            isDestinationPlaceHolder
          />
        )}

        {orders.length === 0 && !(isOver && isCardFromOtherColumn) && (
          <p className="text-subtle py-6 text-center text-xs">Sem pedidos aqui</p>
        )}
      </div>
    </div>
  </div>
);
}