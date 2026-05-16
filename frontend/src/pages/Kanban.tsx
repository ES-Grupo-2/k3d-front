import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import toast from "react-hot-toast";
import { api } from "../api/client";
import type { KanbanColumn, Order } from "../api/types";
import { currency, humanizeEnum } from "../lib/format";
import { Modal } from "../components/Modal";
import { OrderForm } from "../components/OrderForm";
import { useAuth } from "../context/AuthContext";

const COLUMNS: { id: KanbanColumn; title: string }[] = [
  { id: "TODO", title: "A Fazer" },
  { id: "DOING", title: "Fazendo" },
  { id: "DONE", title: "Concluído" },
];

export function KanbanPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Order | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => api.get("/orders").then((r) => r.data),
  });

  const byColumn = useMemo(() => {
    const map: Record<KanbanColumn, Order[]> = { TODO: [], DOING: [], DONE: [] };
    orders?.forEach((o) => map[o.column].push(o));
    return map;
  }, [orders]);

  const createMut = useMutation({
    mutationFn: (payload: any) => api.post("/orders", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido criado");
      setCreating(false);
    },
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Erro ao criar"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      api.put(`/orders/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido atualizado");
      setEditing(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Erro ao salvar"),
  });

  const moveMut = useMutation({
    mutationFn: ({ id, column }: { id: string; column: KanbanColumn }) =>
      api.patch(`/orders/${id}/move`, { column }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Erro ao mover"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/orders/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido removido");
    },
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Sem permissão para remover"),
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function onDrop(e: DragEndEvent) {
    const orderId = String(e.active.id);
    const target = e.over?.id as KanbanColumn | undefined;
    if (!target) return;
    const original = orders?.find((o) => o.id === orderId);
    if (!original || original.column === target) return;
    moveMut.mutate({ id: orderId, column: target });
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kanban</h1>
          <p className="text-sm text-muted">
            Arraste os cards entre colunas — ou clique para editar.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          + Novo pedido
        </button>
      </header>

      <DndContext sensors={sensors} onDragEnd={onDrop}>
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              orders={byColumn[column.id]}
              onEdit={setEditing}
              onDelete={(id) => {
                if (confirm("Tem certeza que deseja remover este pedido?")) deleteMut.mutate(id);
              }}
              canDelete={user?.role === "MANAGER"}
            />
          ))}
        </div>
      </DndContext>

      <Modal open={creating} title="Novo pedido" onClose={() => setCreating(false)}>
        <OrderForm
          onSave={async (payload) => createMut.mutateAsync(payload)}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      <Modal open={!!editing} title="Editar pedido" onClose={() => setEditing(null)}>
        {editing && (
          <OrderForm
            order={editing}
            onSave={async (payload) => updateMut.mutateAsync({ id: editing.id, payload })}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}

function Column({
  id,
  title,
  orders,
  onEdit,
  onDelete,
  canDelete,
}: {
  id: KanbanColumn;
  title: string;
  orders: Order[];
  onEdit: (o: Order) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`panel flex flex-col min-h-0 ${isOver ? "ring-2 ring-primary" : ""}`}
    >
      <header className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted">{title}</h2>
        <span className="text-xs text-subtle">{orders.length}</span>
      </header>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {orders.map((o) => (
          <Card
            key={o.id}
            order={o}
            onEdit={() => onEdit(o)}
            onDelete={() => onDelete(o.id)}
            canDelete={canDelete}
          />
        ))}
        {orders.length === 0 && (
          <p className="text-xs text-subtle text-center py-6">Sem pedidos aqui</p>
        )}
      </div>
    </div>
  );
}

function Card({
  order,
  onEdit,
  onDelete,
  canDelete,
}: {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-background border border-border rounded-md text-sm overflow-hidden shadow-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {/* Top Region — 20% (do design Figma: regiões do card) */}
      <div
        className="px-3 py-2 flex items-center justify-between border-b border-border"
        style={{ borderLeft: `3px solid ${order.tag.color}` }}
      >
        <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
          {order.tag.name}
        </span>
        <div className="flex items-center gap-1">
          <button
            className="text-xs text-subtle hover:text-foreground px-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            ✎
          </button>
          {canDelete && (
            <button
              className="text-xs text-subtle hover:text-danger px-1"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content Region — 60% (handle de arrastar) */}
      <div className="px-3 py-2 cursor-grab" {...listeners} {...attributes}>
        <div className="font-medium leading-tight text-foreground">{order.title}</div>
        <div className="text-xs text-muted mt-1">{order.client.name}</div>
        <div className="text-[11px] text-subtle mt-1">
          Qtde: {order.quantity} · {currency(order.price)}
        </div>
      </div>

      {/* Bottom Region — 20% */}
      <div className="px-3 py-1.5 border-t border-border text-[10px] text-subtle flex justify-between">
        <span>{humanizeEnum(order.status)}</span>
        <span>{humanizeEnum(order.paymentMethod)}</span>
      </div>
    </div>
  );
}
