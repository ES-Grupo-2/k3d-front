"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useState } from "react";
import { Plus } from "lucide-react"; // Importamos o ícone para o botão
import { Button } from "../ui";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { CardEditDialog } from "@/components/kanban/popUp/CardEditDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Order, KanbanTaskStatus } from "@/types/kanban";
import { deleteKanbanOrder, moveKanbanOrder, updateKanbanOrder } from "@/services/kanban/kanban";
import { OrderFormData, UpdateOrderPayload } from "@/types/order";
import { CreateOrderDialog } from "./popUp/CreateOrderDialog";
import { orchestrateOrderCreation, UploadFileApiResponse, uploadOrderFile } from "@/services/order/order";
import { MobileMenuButton } from "@/components/navigation/mobile-nav";

// Importações do novo componente de Tag
import { CreateTagDialog } from "./popUp/createTagDialog"; // Ajuste o caminho se necessário
import { Tag } from "@/types/tags";

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
  
  // Estado para controlar o modal de Tags
  const [tagModalOpen, setTagModalOpen] = useState(false);

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
    const idToDelete = deletingId; 

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

  const handleSaveEdit = async (
    orderId: number,
    payload: UpdateOrderPayload & { file?: File }, 
    localPatch: Partial<Order>,
  ) => {
    setIsSavingEdit(true);
    try {
      if (payload.file) {
        const formData = new FormData();
        formData.append("file", payload.file);

        const uploadResponse = await uploadOrderFile(formData) as UploadFileApiResponse;
        const newArchiveName = uploadResponse.fileName || uploadResponse.data?.fileName;
        
        if (newArchiveName) {
          payload.archive = newArchiveName; 
          localPatch.archive = newArchiveName;
        }
      }

      delete payload.file;

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

  const handleCreateOrder = async (formData: OrderFormData) => {
    setIsCreating(true);
    try {
      if (formData.file && formData.file.length > 0) {
        const data = new FormData();
        data.append("file", formData.file[0]);
        
        const uploadResponse = await uploadOrderFile(data);
        
        if (uploadResponse?.fileName) {
          formData.archive = uploadResponse.fileName;
        }
      }
      
      delete formData.file;

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

  // Função callback para quando a tag for criada
  const handleTagCreated = (newTag: Tag) => {
    // Caso use bibliotecas como sonner ou react-hot-toast, você pode disparar um aviso aqui.
    console.log("Tag cadastrada e pronta para uso:", newTag);
  };

return (
  <div className="flex h-full w-full select-none flex-col overflow-hidden overscroll-none">
    <div className="flex shrink-0 items-center justify-between gap-4 pb-3 md:pb-4">
      <div className="flex items-center gap-2">
        <MobileMenuButton />
        <h1 className="text-2xl font-semibold">Kanban</h1>
      </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 transition-colors hover:cursor-pointer"
            onClick={() => setTagModalOpen(true)}
          >
            <Plus size={16} />
            Nova Tag
          </Button>

          <Button
            variant="default"
            className="transition-colors hover:cursor-pointer hover:bg-primary/90"
            onClick={() => setCreateModalOpen(true)}
          >
            + Novo pedido
          </Button>
        </div>
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

      {/* Renderização do popup de Tags */}
      <CreateTagDialog
        open={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        onTagCreated={handleTagCreated}
      />

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