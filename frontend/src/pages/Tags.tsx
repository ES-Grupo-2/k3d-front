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
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Nova categoria
        </button>
      </header>

      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-2 text-left">Cor</th>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-4 py-2">
                  <span
                    className="inline-block w-4 h-4 rounded"
                    style={{ background: t.color }}
                  />
                </td>
                <td className="px-4 py-2 text-foreground">{t.name}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={() => {
                      setEditing(t);
                      setOpen(true);
                    }}
                  >
                    editar
                  </button>
                  <button
                    className="text-xs text-danger hover:underline"
                    onClick={() => {
                      if (confirm("Remover categoria?")) remove.mutate(t.id);
                    }}
                  >
                    remover
                  </button>
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
  const [color, setColor] = useState(tag?.color ?? "#3b82f6");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, color });
      }}
      className="space-y-3"
    >
      <div>
        <label className="label">Nome</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="label">Cor</label>
        <input
          type="color"
          className="h-10 w-20 rounded bg-surface border border-border cursor-pointer"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
}
