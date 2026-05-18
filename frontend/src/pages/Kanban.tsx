/**
 * @file Tela do quadro Kanban (rota `/kanban`). Cards no estilo glass do
 * EyePleasure, com pill colorida pra status e tag.
 * @author lukasnascimento1
 */
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import toast from "react-hot-toast";
import { api } from "../api/client";
import type { KanbanColumn, Order, OrderStatus } from "../api/types";
import { currency, orderStatusLabel, paymentMethodLabel } from "../lib/format";
import { Modal } from "../components/Modal";
import { OrderForm } from "../components/OrderForm";
import { useAuth } from "../context/AuthContext";

const COLUMNS: { id: KanbanColumn; title: string }[] = [
  { id: "TODO", title: "A Fazer" },
  { id: "DOING", title: "Fazendo" },
  { id: "DONE", title: "Concluído" },
];

// Cor de fundo da pill de status — combina semanticamente com o estado
const STATUS_COLOR: Record<OrderStatus, { bg: string; fg: string }> = {
  PENDING_PRINT: { bg: "rgba(245,158,11,.16)", fg: "var(--ep-warning-soft)" },
  PRINTING: { bg: "rgba(99,102,241,.16)", fg: "var(--ep-primary-soft)" },
  COMPLETED: { bg: "rgba(16,185,129,.16)", fg: "var(--ep-success-soft)" },
  PARTIAL_PAYMENT: { bg: "rgba(245,158,11,.16)", fg: "var(--ep-warning-soft)" },
  PAID: { bg: "rgba(16,185,129,.16)", fg: "var(--ep-success-soft)" },
};

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
    <div className="p-8 h-full flex flex-col">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Kanban</h1>
          <p className="text-[13px] text-muted">
            Arraste os cards entre colunas ou clique para editar.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          + Novo pedido
        </button>
      </header>

      <DndContext sensors={sensors} onDragEnd={onDrop}>
        <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
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

      <Modal open={creating} title="Novo pedido" onClose={() => setCreating(false)} width="max-w-2xl">
        <OrderForm
          onSave={async (payload) => createMut.mutateAsync(payload)}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      <Modal open={!!editing} title="Editar pedido" onClose={() => setEditing(null)} width="max-w-2xl">
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
      className="ep-glass flex flex-col min-h-0"
      style={{
        outline: isOver ? `2px solid var(--ep-primary)` : "none",
        outlineOffset: "-1px",
      }}
    >
      <header className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-bold text-[11px] uppercase tracking-[0.6px] text-faint">{title}</h2>
        <span
          className="inline-flex items-center justify-center min-w-[24px] h-[22px] px-2 rounded-full text-[11px] font-bold"
          style={{ background: "var(--ep-surface-strong)", color: "var(--ep-text-muted)" }}
        >
          {orders.length}
        </span>
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
          <p className="text-[12px] text-faint text-center py-8">Sem pedidos aqui</p>
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

  const statusColors = STATUS_COLOR[order.status];

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "var(--ep-surface-strong)",
        border: "1px solid var(--ep-border-strong)",
        borderRadius: 12,
        boxShadow: "var(--ep-shadow-soft)",
        opacity: isDragging ? 0.5 : 1,
        overflow: "hidden",
      }}
    >
      {/* Top region — tag + ações */}
      <div
        className="px-3.5 py-2.5 flex items-center justify-between border-b border-border-soft"
        style={{ borderLeft: `3px solid ${order.tag.color}` }}
      >
        <span
          className="status-pill"
          style={{
            background: `${order.tag.color}26`,
            color: order.tag.color,
          }}
        >
          {order.tag.name}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            className="w-7 h-7 inline-flex items-center justify-center rounded-md text-faint hover:text-foreground hover:bg-surface-hover transition-colors text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Editar"
          >
            ✎
          </button>
          {canDelete && (
            <button
              className="w-7 h-7 inline-flex items-center justify-center rounded-md text-faint hover:text-error transition-colors text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Remover"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content region — drag handle */}
      <div className="px-3.5 py-3 cursor-grab" {...listeners} {...attributes}>
        <div className="font-bold text-[13.5px] leading-tight text-foreground tracking-tight">
          {order.title}
        </div>
        <div className="text-[12px] text-muted mt-1.5">{order.client.name}</div>
        <div className="text-[11px] text-faint mt-2 flex items-center gap-3">
          <span>Qtde: {order.quantity}</span>
          <span className="font-semibold" style={{ color: "var(--ep-text-soft)" }}>
            {currency(order.price)}
          </span>
        </div>
      </div>

      {/* Bottom region — status + forma pagamento */}
      <div
        className="px-3.5 py-2 border-t border-border-soft flex items-center justify-between gap-2"
        style={{ background: "var(--ep-surface)" }}
      >
        <span
          className="status-pill"
          style={{ background: statusColors.bg, color: statusColors.fg }}
        >
          {orderStatusLabel(order.status)}
        </span>
        <span className="text-[10.5px] text-faint">{paymentMethodLabel(order.paymentMethod)}</span>
      </div>
    </div>
  );
}
