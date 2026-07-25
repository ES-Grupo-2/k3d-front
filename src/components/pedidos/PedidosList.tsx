/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import type { KanbanTaskStatus, PaymentStatus } from "@/types/kanban";
import { currency, humanizePayMethod, humanizePayStatus, humanizeSection } from "@/lib/utils";
import type { ApiOrder } from "@/types/order";
import { getTags } from "@/services/tags";
import { Tag } from "@/types/tags";
// Orders listing for the history screen.
// Purely visual component (server-rendered): receives the already-filtered list
// and presents it as a table on desktop and as cards on mobile.

// Badge colors by flow status (Kanban column).
const COLUMN_BADGE: Record<KanbanTaskStatus, string> = {
  PENDENTE: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300",
  FAZENDO: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  FINALIZADO:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
};

// Badge colors by payment status.
const PAYMENT_STATUS_BADGE: Record<PaymentStatus, string> = {
  NAO_PAGO: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  PAGO_PARCIAL:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  PAGO: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
};

function getStatusByAmountPaid(amountPaid: number, fullPrice: number): PaymentStatus {
  if (amountPaid === 0) {
    return "NAO_PAGO";
  } else if (amountPaid === fullPrice) {
    return "PAGO";
  } else {
    return "PAGO_PARCIAL";
  }
}

function getTagColor(tagId: number, tags: Tag[]): string {
  const tag = tags.find((t:Tag) => Number(t.id) === (tagId));
  return tag ? tag.color : "#777"; // Default color if tag not found
}

function Badge({ className, label }: { className: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function TagPill({ name, color }: { name: string; color: string }) {
  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      {name}
    </span>
  );
}

export async function PedidosList({ orders }: { orders: ApiOrder[] }) {
  const tags = await getTags();

  return (
    <>
      {/* Desktop: table */}
      <div className="border-border bg-card hidden overflow-hidden rounded-xl border md:block">
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground border-border border-b text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Qtde</th>
              <th className="px-4 py-3 text-right font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-border/60 hover:bg-foreground/5 border-b transition-colors last:border-0"
              >
                <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                  #{order.id}
                </td>
                <td className="px-4 py-3">
                  <div className="text-foreground font-medium">
                    {order.title}
                  </div>
                  <TagPill name={order.tag.type} color={getTagColor(order.tag.id, tags)} />
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {order.client.name}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={COLUMN_BADGE[order.section]}
                    label={humanizeSection(order.section)}
                  />
                </td>
                <td className="text-muted-foreground px-4 py-3 text-right tabular-nums">
                  {order.quantity}
                </td>
                <td className="text-foreground px-4 py-3 text-right font-medium tabular-nums">
                  {currency(order.price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <Badge
                      className={PAYMENT_STATUS_BADGE[getStatusByAmountPaid(order.amount_paid, order.price)] || PAYMENT_STATUS_BADGE.NAO_PAGO}
                      label={humanizePayStatus(order.amount_paid, order.price)}
                    />
                    <span className="text-muted-foreground text-xs">
                      {/* The None fallback just exists because the payment_method can be null. */}
                      {humanizePayMethod(order.payment_method || "None")}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border-border bg-card rounded-xl border p-4"
            style={{ borderLeft: `3px solid ${"#89CFF0"}` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-foreground font-medium wrap-break-words">
                  {order.title}
                </div>
                <div className="text-muted-foreground mt-0.5 text-sm wrap-break-words">
                  {order.client.name}
                </div>
              </div>
              <span className="text-muted-foreground shrink-0 font-mono text-xs">
                #{order.id}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                className={COLUMN_BADGE[order.section]}
                label={humanizeSection(order.section)}
              />
              <Badge
                className={PAYMENT_STATUS_BADGE[order.status] || PAYMENT_STATUS_BADGE.PAGO}
                label={humanizePayStatus(order.amount_paid, order.price)}
                />
              <TagPill name={order.tag.type} color={"#777"} />
            </div>

            <div className="border-border/60 text-muted-foreground mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t pt-3 text-sm">
              <span>
                Qtde: {order.quantity} · {humanizePayMethod(order.payment_method || "None")}
              </span>
              <span className="text-foreground font-medium">
                {currency(order.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
