'use server'

import { redirect } from "next/navigation";
import { getSession } from "@/services/auth/session";
import KanbanBoard from "@/components/kanban/kanbanBoard";
import {useState} from "react";
import type { Order, KanbanColumnNames } from "@/types/kanban";


const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    column: 'TODO',
    title: 'Manutenção Preventiva Servidor',
    quantity: 1,
    price: 1500.0,
    status: 'UNPAID',
    paymentMethod: 'PIX',
    client: { id: 'c1', name: 'Empresa Alpha Ltda' },
    tag: { name: 'Infra', color: '#3b82f6' }, 
  },
  {
    id: '2',
    column: 'DOING',
    title: 'Licenças Office 365',
    quantity: 10,
    price: 3500.0,
    status: 'HALFPAID',
    paymentMethod: 'PIX',
    client: { id: 'c2', name: 'Escola Beta' },
    tag: { name: 'Software', color: '#10b981' }, 
  },
  {
    id: '3',
    column: 'DONE',
    title: 'Roteadores Wi-Fi 6',
    quantity: 3,
    price: 1200.0,
    status: 'HALFPAID',
    paymentMethod: 'CREDIT_CARD',
    client: { id: 'c3', name: 'Cafeteria Delta' },
    tag: { name: 'Hardware', color: '#f59e0b' }, 
  },
];


export default async function KanbanPage() {
    const session = await getSession();
    if(!session) redirect("/auth/login");

    const isManager = session.user.role === "GERENTE";

    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

    const handleMoveOrder = (orderId: string, targetColumn: KanbanColumnNames) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, column: targetColumn } : order
        )
      );
    };

    const handleEditOrder = (order: Order) => {
        if(isManager) {
            console.log('Abrir modal de edição para o pedido:', order.title);
        }
    };

    const handleDeleteOrder = (orderId: string) => {
        if(isManager) {
            const confirmDelete = window.confirm('Tem certeza que deseja remover este pedido?');
            if (confirmDelete) {
                setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
            };
        };
    };

    return (
      <div className="flex flex-col h-full">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quadro de Tarefas</h1>
          </div>

          <button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors"
            onClick={() => {}}
          >
            + Novo pedido
          </button>
        </header>

        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            orders={orders}
            onMoveOrder={handleMoveOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
            canDelete={true} // Simulando que o usuário logado tem permissão (MANAGER)
          />
        </div>
      </div>
    );
}
