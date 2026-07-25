/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
'use client'
import { useEffect, useState } from "react";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PedidosFilters, PedidosList } from "@/components/pedidos";
import { MobileMenuButton } from "@/components/navigation/mobile-nav";
import { CreateOrderDialog } from "@/components/kanban/popUp/CreateOrderDialog";
import { orchestrateOrderCreation } from "@/services/order/order";
import { ApiOrder, OrderFormData } from "@/types/order";
import { Tag } from "@/types/tags";

export default function PedidosPage({
  initialOrders,
  tags,
  queryInputParam,
  sectionParam,
  paymentMethodParam,
}: {
  initialOrders: ApiOrder[];
  tags: Tag[];
  queryInputParam: string;
  sectionParam: string;
  paymentMethodParam: string;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateOrder = async (formData: OrderFormData) => {
    setIsCreating(true);
    try {
      const newOrder = await orchestrateOrderCreation(formData);
      
      setOrders((prev) => [newOrder, ...prev]);
      setCreateModalOpen(false);
      
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const totalItems = orders.length;
  
  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">
      <header className="space-y-1">
        <div className="flex justify-between">
          <div>
        <div className="flex items-center gap-2">
            <MobileMenuButton />
            <h1 className="text-2xl font-semibold">Pedidos</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Histórico completo de pedidos — busque, filtre e audite a operação.
          </p>
        </div>

          <div>
            <Button
              variant="default"
              className="transition-colors hover:cursor-pointer hover:bg-primary/90"
              onClick={() => setCreateModalOpen(true)}
              >
              + Novo pedido
            </Button>
          </div>
        </div>
      </header>

      <PedidosFilters
        initialQuery={queryInputParam}
        initialSection={sectionParam}
        initialPayment={paymentMethodParam}
      />

      <p className="text-muted-foreground text-sm">
        {totalItems}{" "}
        {totalItems === 1 ? "pedido encontrado" : "pedidos encontrados"}
      </p>

      {orders.length > 0 ? (
        <PedidosList orders={orders} tags={tags} />
      ) : (
        <div className="border-border text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <PackageSearch className="size-8 opacity-60" />
          <div>
            <p className="text-foreground font-medium">
              Nenhum pedido encontrado
            </p>
            <p className="text-sm">
              Ajuste a busca ou os filtros para ver outros resultados.
            </p>
          </div>
        </div>
      )}

      {createModalOpen && (
        <CreateOrderDialog
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSave={handleCreateOrder}
            isLoading={isCreating}
        />)}
    </div>
  );
}