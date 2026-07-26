"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useState } from "react";
import { Button } from "../ui";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { CardEditDialog } from "@/components/kanban/popUp/CardEditDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Order, KanbanTaskStatus } from "@/types/kanban";
import { deleteKanbanOrder, moveKanbanOrder, updateKanbanOrder } from "@/services/kanban/kanban";
import { OrderFormData, UpdateOrderPayload } from "@/types/order";
import { CreateOrderDialog } from "./popUp/CreateOrderDialog";
import { orchestrateOrderCreation } from "@/services/order/order";
import { MobileMenuButton } from "@/components/navigation/mobile-nav";

type KanbanClientProps = {
  isManager: boolean;
  ordersRequest: Record<string, Order[]>;
}

export function KanbanClient({ isManager, ordersRequest }: KanbanClientProps) {
  const [orders, setOrders] = useState<Order[]>(ordersRequest.PENDENTE.concat(ordersRequest.FAZENDO, ordersRequest.FINALIZADO));
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [, setIsDeleting] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    const previousOrders = [...orders];
    const idToDelete = deletingId; // Salva a referência

    setOrders((prev) => prev.filter((order) => Number(order.id) !== Number(idToDelete)));
    setDeletingId(null);
    setIsDeleting(true);

    try {
      await deleteKanbanOrder(idToDelete);
    } catch (error) {
      console.error("Falha ao deletar pedido:", error);
      alert("Ocorreu um erro ao excluir o pedido. Tente novamente.");
      setOrders(previousOrders);
    } finally {
      setIsDeleting(false);
    }
  };

  // Persiste a edição no backend e aplica o patch otimista à UI só no sucesso.
  const handleSaveEdit = async (
    orderId: number,
    payload: UpdateOrderPayload,
    localPatch: Partial<Order>,
  ) => {
    setIsSavingEdit(true);
    try {
      await updateKanbanOrder(orderId, payload);
      setOrders((prev) =>
        prev.map((order) =>
          Number(order.id) === Number(orderId)
            ? ({ ...order, ...localPatch } as Order)
            : order,
        ),
      );
      setEditingOrder(null);
    } catch (error: unknown) { 
      console.error("Erro ao criar pedido:", error);
      
      if (error instanceof Error) {
        alert(`Erro: ${error.message}`);
      } else {
        alert("Ocorreu um erro desconhecido ao tentar criar o pedido.");
      }
      setIsSavingEdit(false);
    }
  };

  /**
   * Orchestrates the creation of a new Kanban order, including client resolution and file uploads.
   * 
   * This function executes a sequential pipeline to ensure all related entities (Clients, 
   * Orders, and MinIO Storage) are synchronized. It prioritizes uploading the physical file 
   * to retrieve its unique storage key before saving the final entity in the database.
   * 
   * @async
   * @param {OrderFormData} formData - The payload collected from the CreateOrderDialog form.
   * 
   * @pipeline
   * 1. **Client Resolution:** Checks if the order belongs to an existing client. If the "New Client" 
   *    tab was used, it dispatches a POST request to create a new client and retrieves the `clientId`.
   * 2. **File Upload (Optional):** If a physical file is attached, it sends it to the backend API 
   *    to be stored in MinIO, retrieving the unique generated `fileName`. If no file is present, 
   *    it falls back to the external archive link (e.g., Google Drive) if provided by the user.
   * 3. **Order Creation:** Dispatches a POST request to create the order in the database, directly 
   *    linking the resolved `clientId` and the `archive` string (storage filename or external link).
   * 4. **UI Hydration:** Injects the UI-friendly relationship properties (`client.name`, `tag.type`) 
   *    into the newly created order and updates the local React state (`setOrders`) to display the 
   *    card immediately on the Kanban board.
   * 
   * @throws {Error} Will throw an error if client creation fails, the file upload process 
   * is interrupted, or the final order creation fails.
   */
  const handleCreateOrder = async (formData: OrderFormData) => {
    setIsCreating(true);
    try {
      const newOrder = await orchestrateOrderCreation(formData);
      
      setOrders((prev) => [newOrder, ...prev]);
      setCreateModalOpen(false);
      
    } catch (error: unknown) { 
      console.error("Erro ao criar pedido:", error);
      
      if (error instanceof Error) {
        alert(`Erro: ${error.message}`);
      } else {
        alert("Ocorreu um erro desconhecido ao tentar criar o pedido.");
      }
      setIsCreating(false);
    }
  };

return (
  <div className="flex h-full w-full select-none flex-col overflow-hidden overscroll-none">
    <div className="flex shrink-0 items-center justify-between gap-4 pb-3 md:pb-4">
      <div className="flex items-center gap-2">
        <MobileMenuButton />
        <h1 className="text-2xl font-semibold">Kanban</h1>
      </div>
      {isManager && (
        <Button
          variant="default"
          className="transition-colors hover:cursor-pointer hover:bg-primary/90"
          onClick={() => setCreateModalOpen(true)}
        >
          + Novo pedido
        </Button>
      )}
    </div>

      <div className="min-h-0 flex-1 flex-col overflow-hidden">
        <KanbanBoard
          orders={orders}
          onMoveOrder={handleMoveOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          isManager={isManager}
        />
      </div>

      <CreateOrderDialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateOrder}
        isLoading={isCreating}
      />

      <CardEditDialog
        open={editingOrder !== null}
        onClose={() => setEditingOrder(null)}
        order={editingOrder}
        onSave={handleSaveEdit}
        isSaving={isSavingEdit}
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
