'use client'; // REMOVER DEPOIS, pois atual está usando estado local (useState) para o mock

import { useState } from 'react';
import KanbanBoard from '@/components/kanban/kanbanBoard';
import type { Order, KanbanColumn } from '@/types/interfaces/interfaces';

// MOCK PARA TESTE, REMOVER DEPOIS
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    column: 'TODO',
    title: 'Manutenção Preventiva Servidor',
    quantity: 1,
    price: 1500.0,
    status: 'PENDING',
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
    status: 'IN_SEPARATION',
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

export default function KanbanPage() {
  // Estado temporário para simular o banco de dados/Zustand
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const handleMoveOrder = (orderId: string, targetColumn: KanbanColumn) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, column: targetColumn } : order
      )
    );
  };

  const handleEditOrder = (order: Order) => {
    // Por enquanto apenas logamos, depois isso abrirá o componente <Modal>
    console.log('Abrir modal de edição para o pedido:', order.title);
  };

  const handleDeleteOrder = (orderId: string) => {
    const confirmDelete = window.confirm('Tem certeza que deseja remover este pedido?');
    if (confirmDelete) {
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Quadro de Tarefas</h1>
        </div>
        
        {/* Usando classes genéricas do Tailwind simulando um botão do shadcn */}
        <button 
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors"
          onClick={() => console.log('Abrir modal de criação')}
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