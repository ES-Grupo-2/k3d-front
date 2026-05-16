/**
 * @file Tela de gestão de Clientes (rota `/clients`). Visualização disponível
 * para ambos os perfis, mas apenas Gerente pode editar ou remover (controle
 * exibido condicionalmente conforme o `role` do usuário).
 * @author lukasnascimento1
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "../api/client";
import type { Client } from "../api/types";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";

/**
 * Página de Clientes. Lista a tabela de clientes cadastrados e expõe um modal
 * para criar/editar. Operadores podem visualizar e criar; só Gerentes podem
 * editar ou remover (regra reforçada também no backend).
 *
 * **Onde é usada:** rota `/clients` em `App.tsx`.
 */
export function ClientsPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const { data } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => api.get("/clients").then((r) => r.data),
  });

  /**
   * Mutação combinada de criar e editar — escolhe a rota a partir da
   * presença de `payload.id`. Centraliza a lógica em uma única definição.
   */
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

  /** Mutação de remoção (`DELETE /clients/:id`). Restrita a Gerente no backend. */
  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/clients/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente removido");
    },
    onError: (e: any) => toast.error(e.response?.data?.mensagem ?? "Sem permissão"),
  });

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          + Novo cliente
        </button>
      </header>

      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Telefone</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-2 text-foreground">{c.name}</td>
                <td className="px-4 py-2 text-muted">{c.phone ?? "—"}</td>
                <td className="px-4 py-2 text-muted">{c.email ?? "—"}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  {user?.role === "MANAGER" && (
                    <>
                      <button
                        className="text-xs text-primary hover:underline"
                        onClick={() => {
                          setEditing(c);
                          setOpen(true);
                        }}
                      >
                        editar
                      </button>
                      <button
                        className="text-xs text-danger hover:underline"
                        onClick={() => {
                          if (confirm("Remover este cliente?")) remove.mutate(c.id);
                        }}
                      >
                        remover
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-subtle">
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

/**
 * Formulário interno de cliente. Mantém estado local dos três campos e
 * delega a persistência para o `onSave` do pai (que decide criar vs editar).
 *
 * **Onde é usado:** apenas dentro de `ClientsPage` (componente interno).
 *
 * @param client - cliente a editar; se `null/undefined`, cria um novo
 * @param onSave - callback de persistência
 * @param onCancel - callback de cancelamento (fecha o modal)
 */
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
      className="space-y-3"
    >
      <div>
        <label className="label">Nome</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="label">Telefone</label>
        <input className="input" value={phone ?? ""} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={email ?? ""}
          onChange={(e) => setEmail(e.target.value)}
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
