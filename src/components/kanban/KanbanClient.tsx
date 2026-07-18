"use client";

import { useState } from "react";
import { Button } from "../ui";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { CardEditDialog } from "@/components/kanban/CardEditDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { CardFormData } from "@/components/kanban/CardEditDialog";
import type { Order, KanbanTaskStatus } from "@/types/kanban";

type KanbanClientProps = {
  isManager: boolean;
  ordersRequest: Record<string, Order[]>;
}

export function KanbanClient({ isManager, ordersRequest }: KanbanClientProps) {
  const [orders, setOrders] = useState<Order[]>(ordersRequest.PENDENTE.concat(ordersRequest.FAZENDO, ordersRequest.FINALIZADO));
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deletingOrder = orders.find((order) => Number(order.id) === Number(deletingId)) ?? null;

  const handleMoveOrder = (orderId: number, targetColumn: KanbanTaskStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        Number(order.id) === orderId ? { ...order, section: targetColumn } : order,
      ),
    );
  };

  const handleEditOrder = (order: Order) => {
    if (isManager) {
      setEditingOrder(order);
    }
  };

  const handleDeleteOrder = (orderId: number) => {
    if (isManager) {
      setDeletingId(orderId);
    }
  };

  const handleSaveEdit = (data: CardFormData) => {
    if (!editingOrder) return;
    
    setOrders((prev) =>
      prev.map((order) =>
        Number(order.id) === Number(editingOrder.id) ? { ...order, ...data } : order,
      ),
    );
    setEditingOrder(null);
  };

  const handleConfirmDelete = () => {
    setOrders((prev) => prev.filter((order) => Number(order.id) !== Number(deletingId)));
    setDeletingId(null);
  };
return (
  <div className="flex h-svh w-full select-none flex-col overflow-hidden overscroll-none">
    <header className="flex shrink-0 justify-end px-5 py-4">
      {isManager && (
        <Button variant="default" className="transition-colors hover:cursor-pointer hover:bg-primary/90">
          + Novo pedido
        </Button>
      )}
    </header>

    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <KanbanBoard
        orders={orders}
        onMoveOrder={handleMoveOrder}
        onEditOrder={handleEditOrder}
        onDeleteOrder={handleDeleteOrder}
        isManager={isManager}
      />
    </div>

      <CardEditDialog
        open={editingOrder !== null}
        onClose={() => setEditingOrder(null)}
        initialValues={{
          title: editingOrder?.title ?? "",
          description: "", 
        }}
        onSave={handleSaveEdit}
      />

      <ConfirmDialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        tone="destructive"
        title="Excluir card?"
        description={
          deletingOrder
            ? `Tem certeza que deseja excluir “${deletingOrder.title}”? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
