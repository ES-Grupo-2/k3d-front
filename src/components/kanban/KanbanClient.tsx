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
import { createKanbanOrder, deleteKanbanOrder, moveKanbanOrder, updateKanbanOrder } from "@/services/kanban/kanban";
import { OrderFormData, UpdateOrderPayload } from "@/types/order";
import { CreateOrderDialog } from "./popUp/CreateOrderDialog";
import { createClient, uploadOrderFile } from "@/services/order/order";
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
        const uploadResponse = await uploadOrderFile(payload.file) as any;
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
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Ocorreu um erro ao salvar o pedido.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCreateOrder = async (formData: OrderFormData) => {
    setIsCreating(true);
    try {
      let finalClientId = formData.clientId;
      let finalClientName = ""; 

      if (!finalClientId && formData.newClientName) {
        const clientResponse = await createClient({ 
          name: formData.newClientName, 
          phone: formData.newClientPhone || "" 
        });

        if (!clientResponse || !clientResponse.id) {
            throw new Error("Falha ao criar o novo cliente. ID não retornado.");
        }
        finalClientId = clientResponse.id;
        finalClientName = formData.newClientName; 
      } else {
        finalClientName = (formData as OrderFormData).newClientName || "Cliente"; 
      }

      if (!finalClientId) throw new Error("Cliente é obrigatório!");

      let finalArchiveName = formData.archive || ""; 
      if (formData.file && formData.file.length > 0) {
        const fileToUpload = formData.file[0];
        
        const uploadResponse = await uploadOrderFile(fileToUpload);
        
        finalArchiveName = uploadResponse.fileName; 
      }

      const initialPayload = {
        title: formData.title,
        client_id: Number(finalClientId), 
        tagType: formData.tagType,          
        price: formData.price,
        amount_paid: formData.amount_paid,
        cost: formData.cost,
        quantity: formData.quantity,
        payment_method: formData.payment_method,
        archive: finalArchiveName, 
      };

      const newOrder = await createKanbanOrder(initialPayload);
      
      newOrder.tag = { type: formData.tagType }; 
      newOrder.client = { name: finalClientName };
      
      setOrders((prev) => [newOrder, ...prev]);
      setCreateModalOpen(false);
      
    } catch (error) {
      console.error(error);
      alert("Erro ao criar o pedido. Verifique os dados e tente novamente.");
    } finally {
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
      
      {/* Agrupamos os botões em uma div flex caso o usuário seja gerente */}
      {isManager && (
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