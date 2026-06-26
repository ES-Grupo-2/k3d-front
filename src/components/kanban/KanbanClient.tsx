"use client";

import { useState } from "react";
import { Button } from "../ui";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { CardEditDialog } from "@/components/kanban/CardEditDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { CardFormData } from "@/components/kanban/CardEditDialog";
import type { Order, KanbanColumnNames } from "@/types/kanban";

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    column: "TODO",
    title: "Manutenção Preventiva Servidor",
    quantity: 1,
    price: 1500.0,
    status: "UNPAID",
    paymentMethod: "PIX",
    client: { id: "c1", name: "Empresa Alpha Ltda" },
    tag: { name: "Infra", color: "#3b82f6" },
  },
  {
    id: "2",
    column: "DOING",
    title: "Licenças Office 365",
    quantity: 10,
    price: 3500.0,
    status: "HALFPAID",
    paymentMethod: "PIX",
    client: { id: "c2", name: "Escola Beta" },
    tag: { name: "Software", color: "#10b981" },
  },
  {
    id: "3",
    column: "DONE",
    title: "Roteadores Wi-Fi 6",
    quantity: 3,
    price: 1200.0,
    status: "HALFPAID",
    paymentMethod: "CREDIT_CARD",
    client: { id: "c3", name: "Cafeteria Delta" },
    tag: { name: "Hardware", color: "#f59e0b" },
  },
  {
    id: "4",
    column: "DONE",
    title: "Roteadores Wi-Fi 6",
    quantity: 3,
    price: 1500.0,
    status: "HALFPAID",
    paymentMethod: "CREDIT_CARD",
    client: {
      id: "c3",
      name: `${"(Exemplo de Cliente com nome grande\n)".repeat(10)}`,
    },
    tag: { name: "Hardware", color: "#f59e0b" },
  },
  {
    id: "5",
    column: "DONE",
    title: "Roteadores Wi-Fi 6",
    quantity: 3,
    price: 1200.0,
    status: "HALFPAID",
    paymentMethod: "CREDIT_CARD",
    client: { id: "c3", name: "Cafeteria Delta" },
    tag: { name: "Hardware", color: "#f59e0b" },
  },
  {
    id: "6",
    column: "DONE",
    title: "Roteadores Wi-Fi 6",
    quantity: 3,
    price: 1200.0,
    status: "HALFPAID",
    paymentMethod: "CREDIT_CARD",
    client: { id: "c3", name: "Cafeteria Delta" },
    tag: { name: "Hardware", color: "#f59e0b" },
  },
];

export function KanbanClient({ isManager }: { isManager: boolean }) {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  // 1. Novos estados importados da branch do colega
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Helper para o modal de deleção saber o nome do pedido
  const deletingOrder = orders.find((order) => order.id === deletingId) ?? null;

  // --- HANDLERS DO BOARD ---

  const handleMoveOrder = (orderId: string, targetColumn: KanbanColumnNames) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, column: targetColumn } : order,
      ),
    );
  };

  const handleEditOrder = (order: Order) => {
    if (isManager) {
      setEditingOrder(order); // Abre o modal injetando o objeto
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (isManager) {
      setDeletingId(orderId); // Abre o modal de confirmação
    }
  };

  // --- HANDLERS DOS MODAIS ---

  const handleSaveEdit = (data: CardFormData) => {
    if (!editingOrder) return;
    
    setOrders((prev) =>
      prev.map((order) =>
        order.id === editingOrder.id ? { ...order, ...data } : order,
      ),
    );
    setEditingOrder(null); // Fecha o modal
  };

  const handleConfirmDelete = () => {
    setOrders((prev) => prev.filter((order) => order.id !== deletingId));
    setDeletingId(null); // Fecha o modal
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
          onEditOrder={handleEditOrder} // Passando os novos handlers
          onDeleteOrder={handleDeleteOrder}
          isManager={isManager}
        />
      </div>

      <CardEditDialog
        open={editingOrder !== null}
        onClose={() => setEditingOrder(null)}
        initialValues={{
          title: editingOrder?.title ?? "",
          // Nota de tipagem: Se a interface Order oficial não tiver 'description',
          // o modal do seu colega pode precisar de um ajuste ou você deve mapear esse dado.
          description: (editingOrder as any)?.description ?? "", 
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
