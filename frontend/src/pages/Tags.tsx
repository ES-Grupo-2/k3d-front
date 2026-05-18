/**
 * @file Tela de gestão de Categorias (rota `/tags`). Restrita ao MANAGER.
 * @author lukasnascimento1
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "../api/client";
import type { Tag } from "../api/types";
import { Modal } from "../components/Modal";

export function TagsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);

  const { data } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: () => api.get("/tags").then((r) => r.data),
  });

  const save = useMutation({
    mutationFn: (payload: Partial<Tag> & { id?: string }) =>
      payload.id
        ? api.put(`/tags/${payload.id}`, payload).then((r) => r.data)
        : api.post("/tags", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Categoria salva");
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Erro ao salvar"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/tags/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Erro ao remover"),
  });

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Categorias</h1>
          <p className="text-[13px] text-muted">Tags coloridas usadas no Kanban e Dashboards.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Nova categoria
        </button>
      </header>

      <div className="ep-glass overflow-hidden">
        <table className="ep-table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Cor</th>
              <th>Nome</th>
              <th style={{ textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((t) => (
              <tr key={t.id}>
                <td>
                  <span
                    className="inline-block w-5 h-5 rounded-md"
                    style={{ background: t.color, boxShadow: `0 0 0 1px var(--ep-border-strong)` }}
                  />
                </td>
                <td style={{ color: "var(--ep-text)", fontWeight: 600 }}>{t.name}</td>
                <td style={{ textAlign: "right" }}>
                  <span className="inline-flex gap-3">
                    <button
                      className="text-[12px] font-semibold hover:underline"
                      style={{ color: "var(--ep-primary-soft)" }}
                      onClick={() => {
                        setEditing(t);
                        setOpen(true);
                      }}
                    >
                      editar
                    </button>
                    <button
                      className="text-[12px] font-semibold hover:underline"
                      style={{ color: "var(--ep-error-soft)" }}
                      onClick={() => {
                        if (confirm("Remover categoria?")) remove.mutate(t.id);
                      }}
                    >
                      remover
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editing ? "Editar categoria" : "Nova categoria"}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <TagForm
          tag={editing}
          onSave={(p) => save.mutate({ ...p, id: editing?.id })}
          onCancel={() => {
            setOpen(false);
            setEditing(null);
          }}
        />
      </Modal>
    </div>
  );
}

function TagForm({
  tag,
  onSave,
  onCancel,
}: {
  tag?: Tag | null;
  onSave: (p: Partial<Tag>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState(tag?.color ?? "#6366f1");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, color });
      }}
    >
      <div className="field">
        <label>Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Cor</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ height: 46, padding: 4, cursor: "pointer" }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-glass" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
}
