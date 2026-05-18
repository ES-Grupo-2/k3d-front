/**
 * @file Tela de gestão de Clientes (rota `/clients`). Tabela `ep-table` no
 * estilo EyePleasure.
 * @author lukasnascimento1
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "../api/client";
import type { Client } from "../api/types";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export function ClientsPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const { data } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => api.get("/clients").then((r) => r.data),
  });

  const save = useMutation({
    mutationFn: (payload: Partial<Client> & { id?: string }) =>
      payload.id
        ? api.put(`/clients/${payload.id}`, payload).then((r) => r.data)
        : api.post("/clients", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente salvo");
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Erro ao salvar"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/clients/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente removido");
    },
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Sem permissão"),
  });

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Clientes</h1>
          <p className="text-[13px] text-muted">Gestão da base de clientes da loja.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Novo cliente
        </button>
      </header>

      <div className="ep-glass overflow-hidden">
        <table className="ep-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th style={{ textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c) => (
              <tr key={c.id}>
                <td style={{ color: "var(--ep-text)", fontWeight: 600 }}>{c.name}</td>
                <td style={{ color: "var(--ep-text-muted)" }}>{c.phone ?? "—"}</td>
                <td style={{ color: "var(--ep-text-muted)" }}>{c.email ?? "—"}</td>
                <td style={{ textAlign: "right" }}>
                  {user?.role === "MANAGER" && (
                    <span className="inline-flex gap-3">
                      <button
                        className="text-[12px] font-semibold hover:underline"
                        style={{ color: "var(--ep-primary-soft)" }}
                        onClick={() => {
                          setEditing(c);
                          setOpen(true);
                        }}
                      >
                        editar
                      </button>
                      <button
                        className="text-[12px] font-semibold hover:underline"
                        style={{ color: "var(--ep-error-soft)" }}
                        onClick={() => {
                          if (confirm("Remover este cliente?")) remove.mutate(c.id);
                        }}
                      >
                        remover
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 40, color: "var(--ep-text-faint)" }}>
                  Nenhum cliente cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editing ? "Editar cliente" : "Novo cliente"}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <ClientForm
          client={editing}
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

function ClientForm({
  client,
  onSave,
  onCancel,
}: {
  client?: Client | null;
  onSave: (p: Partial<Client>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(client?.name ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ name, phone: phone || null, email: email || null });
      }}
    >
      <div className="field">
        <label>Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Telefone</label>
        <input value={phone ?? ""} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="field">
        <label>Email</label>
        <input type="email" value={email ?? ""} onChange={(e) => setEmail(e.target.value)} />
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
