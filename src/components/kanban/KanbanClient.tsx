"use client";

import { useState } from "react";
import { Button } from "../ui";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { CardEditDialog } from "@/components/kanban/popUp/CardEditDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { CardFormData } from "@/components/kanban/popUp/CardEditDialog";
import type { Order, KanbanTaskStatus } from "@/types/kanban";
import { createKanbanOrder, moveKanbanOrder } from "@/services/kanban/kanban";
import { CreateOrderDTO, OrderFormData } from "@/types/order";
import { CreateOrderDialog } from "./popUp/CreateOrderDialog";
import { createClient, getPresignedUrl, uploadFileToMinIO } from "@/services/order/order";

type KanbanClientProps = {
  isManager: boolean;
  ordersRequest: Record<string, Order[]>;
}

export function KanbanClient({ isManager, ordersRequest }: KanbanClientProps) {
  const [orders, setOrders] = useState<Order[]>(ordersRequest.PENDENTE.concat(ordersRequest.FAZENDO, ordersRequest.FINALIZADO));
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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

  /**
   * WORK IN PROGRESS - THIS FUNCTION WILL BE REFACTORED SINCE THE DELETE ORDER ENDPOINT IS GOING TO CHANGE
 * Orchestrates the creation of a new Kanban order, including client resolution and file uploads.
 * * This function executes a multi-step pipeline (Deferred Upload Pattern) to ensure all related 
 * entities (Clients, Orders, and MinIO Storage) are synchronized without passing heavy files 
 * through the main Node.js backend.
 * * @async
 * @param {OrderFormData} formData - The payload collected from the CreateOrderDialog form.
 * * @pipeline
 * 1. **Client Resolution:** Checks if the order belongs to an existing client. If the "New Client" 
 * tab was used, it dispatches a POST request to create a new client and retrieves the generated `clientId`.
 * 2. **Initial Order Creation:** Dispatches a POST request to create the base order in the database 
 * (without the file attached) to generate the official `orderId` (Task ID).
 * 3. **Presigned URL Generation (Optional):** If a file is attached, it requests a short-lived, 
 * presigned upload URL from the backend using the generated `orderId` and the filename.
 * 4. **Direct Storage Upload (Optional):** Uploads the physical file directly to the MinIO bucket 
 * using the presigned URL via a PUT request, bypassing the main backend API.
 * 5. **Order Patching (Optional):** Dispatches a PATCH request to update the newly created order 
 * with the final `fileUrl` (filename) to link the storage object to the database entity.
 * 6. **UI Hydration:** Updates the local React state (`setOrders`) to display the new card 
 * immediately on the Kanban board and safely closes the modal.
 * * @throws {Error} Will throw an error if client creation fails, order creation fails, 
 * or if the storage upload process is interrupted.
 */
  const handleCreateOrder = async (formData: OrderFormData) => {
    setIsCreating(true);
    try {
      let finalClientId = formData.clientId;

      if (!finalClientId && formData.newClientName) {
        const clientResponse = await createClient({ 
          name: formData.newClientName, 
          phone: formData.newClientPhone || "" 
        });

        // Garante que a API de clientes retornou um ID válido
        if (!clientResponse || !clientResponse.id) {
            throw new Error("Falha ao criar o novo cliente. ID não retornado.");
        }
        finalClientId = clientResponse.id;
        }

      if (!finalClientId) throw new Error("Cliente é obrigatório!");

      const initialPayload = {
        title: formData.title,
        client_id: Number(finalClientId), 
        tagType: formData.tagType,          
        price: formData.price,
        amount_paid: formData.amount_paid,
        cost: formData.cost,
        quantity: formData.quantity,
        payment_method: formData.payment_method,
        archive: formData.archive,           
      };

      const newOrder = await createKanbanOrder(initialPayload);

      if (formData.file && formData.file.length > 0) {
        const fileToUpload = formData.file[0];
        
        const { url: presignedUrl } = await getPresignedUrl(
          String(newOrder.id), 
          fileToUpload.name, 
        );
        
        await uploadFileToMinIO(presignedUrl, fileToUpload);

        // Patch to update the order with the file URL (filename) in the database
        // await updateKanbanOrderAction(newOrder.id, { fileUrl: fileToUpload.name });
        
        newOrder.archive = fileToUpload.name; // Locally updates the UI
      }
      
      setOrders((prev) => [newOrder, ...prev]);
      setCreateModalOpen(false);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

return (
  <div className="flex h-svh w-full select-none flex-col overflow-hidden overscroll-none">
    <header className="flex shrink-0 justify-end px-5 py-4">
      {isManager && (
        <Button variant="default" className="transition-colors hover:cursor-pointer hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
          + Novo pedido
        </Button>
      )}
    </header>

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
