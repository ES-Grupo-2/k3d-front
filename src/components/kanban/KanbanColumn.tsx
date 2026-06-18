import { useDroppable, useDndContext } from "@dnd-kit/core";
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
      className={`panel bg-background flex h-full flex-col rounded-sm border-2 border-solid ${isOver ? "border-primary" : ""}`}
    >
      <header className="border-border flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-foreground text-sm font-semibold tracking-wider uppercase">
          {title}
        </h2>
        <span className="text-subtle bg-foreground/10 rounded-full border-0 px-3 py-1 text-xs">
          {orders.length}
        </span>
      </header>

      <div className="flex-1 space-y-3 p-3">
        {orders.map((o) => (
          <KanbanCard
            key={o.id}
            order={o}
            onEdit={() => onEdit(o)}
            onDelete={() => onDelete(o.id)}
            isManager={isManager}
          />
        ))}
        {isOver && isCardFromOtherColumn && draggedOrder && (
          <KanbanCard
            order={draggedOrder}
            onEdit={() => {}}
            onDelete={() => {}}
            isManager={isManager}
            isDestinationPlaceHolder={true}
          />
        )}

        {orders.length === 0 && !(isOver && isCardFromOtherColumn) && (
          <p className="text-subtle py-6 text-center text-xs">
            Sem pedidos aqui
          </p>
        )}
      </div>
    </div>
  );
}
