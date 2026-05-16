import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";
import type { Client, Order, Tag } from "../api/types";
import { PAYMENT_METHOD_OPTIONS, STATUS_OPTIONS, humanizeEnum } from "../lib/format";

type Props = {
  order?: Order | null;
  onSave: (payload: any) => Promise<void>;
  onCancel: () => void;
};

export function OrderForm({ order, onSave, onCancel }: Props) {
  const { data: clients } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => api.get("/clients").then((r) => r.data),
  });
  const { data: tags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: () => api.get("/tags").then((r) => r.data),
  });

  const [form, setForm] = useState({
    title: order?.title ?? "",
    clientId: order?.client.id ?? "",
    tagId: order?.tag.id ?? "",
    price: order?.price ?? 0,
    amountPaid: order?.amountPaid ?? 0,
    cost: order?.cost ?? 0,
    quantity: order?.quantity ?? 1,
    paymentMethod: order?.paymentMethod ?? "PIX",
    status: order?.status ?? "PENDING_PRINT",
    notes: order?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientId || !form.tagId) {
      toast.error("Selecione cliente e categoria");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        amountPaid: Number(form.amountPaid),
        cost: Number(form.cost),
        quantity: Number(form.quantity),
      });
    } finally {
      setSaving(false);
    }
  }

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="label">Título</label>
        <input
          className="input"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Cliente</label>
          <select
            className="input"
            value={form.clientId}
            onChange={(e) => update("clientId", e.target.value)}
            required
          >
            <option value="">Selecione…</option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Categoria</label>
          <select
            className="input"
            value={form.tagId}
            onChange={(e) => update("tagId", e.target.value)}
            required
          >
            <option value="">Selecione…</option>
            {tags?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="label">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            value={String(form.price)}
            onChange={(e) => update("price", e.target.value as any)}
          />
        </div>
        <div>
          <label className="label">Valor pago</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            value={String(form.amountPaid)}
            onChange={(e) => update("amountPaid", e.target.value as any)}
          />
        </div>
        <div>
          <label className="label">Custo</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input"
            value={String(form.cost)}
            onChange={(e) => update("cost", e.target.value as any)}
          />
        </div>
        <div>
          <label className="label">Quantidade</label>
          <input
            type="number"
            min="1"
            className="input"
            value={form.quantity}
            onChange={(e) => update("quantity", Number(e.target.value) as any)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Forma de pagamento</label>
          <select
            className="input"
            value={form.paymentMethod}
            onChange={(e) => update("paymentMethod", e.target.value as any)}
          >
            {PAYMENT_METHOD_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {humanizeEnum(f)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={form.status}
            onChange={(e) => update("status", e.target.value as any)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {humanizeEnum(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Observações</label>
        <textarea
          className="input min-h-[60px]"
          value={form.notes ?? ""}
          onChange={(e) => update("notes", e.target.value as any)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
