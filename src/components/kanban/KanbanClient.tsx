"use client";

import { useState } from "react";
import { Button } from "../ui";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { CardEditDialog } from "@/components/kanban/CardEditDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { CardFormData } from "@/components/kanban/CardEditDialog";
import type { Order, KanbanTaskStatus } from "@/types/kanban";
import { moveKanbanOrder } from "@/services/kanban/kanban";

type KanbanClientProps = {
  isManager: boolean;
  ordersRequest: Record<string, Order[]>;
}

export function KanbanClient({ isManager, ordersRequest }: KanbanClientProps) {
  const [orders, setOrders] = useState<Order[]>(ordersRequest.PENDENTE.concat(ordersRequest.FAZENDO, ordersRequest.FINALIZADO));
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deletingOrder = orders.find((order) => Number(order.id) === Number(deletingId)) ?? null;

  const handleMoveOrder = async (orderId: number, targetColumn: KanbanTaskStatus) => {
    const previousOrders = [...orders];

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, section: targetColumn } : order,
      ),
    );

    try {
      await moveKanbanOrder(orderId, targetColumn);
    } catch (error) {
      console.error(error);
      setOrders(previousOrders);
      // Toast notification can be added here
    }
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
    <div className="flex flex-col h-full">
      <header className="mb-5 mr-5 flex shrink-0 justify-end">
        {isManager && (
          <Button variant="default" className="hover:cursor-pointer hover:bg-primary/90 transition-colors"> 
            + Novo pedido
          </Button>
        )}
      </header>

      <div className="min-h-0 flex-1">
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
