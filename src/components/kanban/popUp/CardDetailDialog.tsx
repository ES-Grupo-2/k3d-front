"use client";

/**
 * @author lukasnascimento1
 */

// Modal de detalhes do pedido, aberto ao clicar num card do Kanban.
// Exibe todas as informações do pedido em modo leitura (produto, cliente,
// financeiro e arquivo vinculado) e oferece atalho para edição ao gerente.

import { CreditCard, Paperclip, User } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import {
  currency,
  humanizePayMethod,
  humanizePayStatus,
  humanizeSection,
} from "@/lib/utils";
import type { Order } from "@/types/kanban";

interface CardDetailDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  isManager: boolean;
  onEdit: () => void;
}

// Linha rótulo/valor reutilizada no corpo do modal.
function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
      <span className="text-foreground text-sm">{value}</span>
    </div>
  );
}

export function CardDetailDialog({
  open,
  onClose,
  order,
  isManager,
  onEdit,
}: CardDetailDialogProps) {
  if (!order) return null;

  const file = order.archive?.trim();
  const isFileLink = !!file && /^https?:\/\//i.test(file);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent size="lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: order.tag?.color || "#777" }}
            />
            <DialogTitle>{order.title}</DialogTitle>
          </div>
          <DialogDescription>
            {order.tag?.type} · {humanizeSection(order.section)}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-6">
          <section className="space-y-3">
            <h3 className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold uppercase">
              <User className="size-3.5" /> Cliente
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Nome" value={order.client?.name || "—"} />
              <DetailRow label="Telefone" value={order.client?.phone || "—"} />
              {order.client?.email ? (
                <DetailRow label="E-mail" value={order.client.email} />
              ) : null}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold uppercase">
              <CreditCard className="size-3.5" /> Financeiro
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Quantidade" value={`${order.quantity || 1} un`} />
              <DetailRow label="Preço total" value={currency(order.price)} />
              <DetailRow
                label="Custo"
                value={order.cost != null ? currency(order.cost) : "—"}
              />
              <DetailRow label="Valor pago" value={currency(order.amount_paid)} />
              <DetailRow
                label="Método"
                value={humanizePayMethod(order.payment_method || "None")}
              />
              <DetailRow
                label="Status"
                value={humanizePayStatus(order.amount_paid || 0, order.price)}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold uppercase">
              <Paperclip className="size-3.5" /> Arquivo
            </h3>
            {file ? (
              isFileLink ? (
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-2 text-sm underline underline-offset-2 hover:opacity-80"
                >
                  <Paperclip className="size-4" />
                  Abrir arquivo
                </a>
              ) : (
                <span className="text-foreground bg-muted inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm">
                  <Paperclip className="size-4 shrink-0" />
                  {file}
                </span>
              )
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhum arquivo vinculado.
              </p>
            )}
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {isManager ? (
            <Button onClick={onEdit}>Editar</Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
