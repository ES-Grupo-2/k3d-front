"use client";

import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useState } from "react";
import { Button } from "../ui";
import type { Order, KanbanTaskStatus } from "@/types/kanban";

type KanbanClientProps = {
  isManager: boolean;
  ordersRequest: Record<string, Order[]>;
}

export function KanbanClient({ isManager, ordersRequest }: KanbanClientProps) {
  const [orders, setOrders] = useState<Order[]>(ordersRequest.PENDENTE.concat(ordersRequest.FAZENDO, ordersRequest.FINALIZADO));

  const handleMoveOrder = (
      orderId: string,
      targetColumn: KanbanTaskStatus,
    ) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, column: targetColumn } : order,
        ),
      );
    };

    const handleEditOrder = () => {
      if (isManager) {}
    };

    const handleDeleteOrder = (orderId: string) => {
      if (isManager) {
        const confirmDelete = window.confirm(
          "Tem certeza que deseja remover este pedido?",
        );
        if (confirmDelete) {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== orderId),
          );
        }
      }
    };

  return (
    <div className="flex flex-col ">
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
    </div>
  );
}
