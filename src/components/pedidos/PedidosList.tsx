import type { KanbanColumnNames, Order, PaymentStatus } from "@/types/kanban";
import { currency, humanizeEnum } from "@/lib/utils";

// Orders listing for the history screen.
// Purely visual component (server-rendered): receives the already-filtered list
// and presents it as a table on desktop and as cards on mobile.

// Badge colors by flow status (Kanban column).
const COLUMN_BADGE: Record<KanbanColumnNames, string> = {
  TODO: "bg-zinc-500/15 text-zinc-300",
  DOING: "bg-amber-500/15 text-amber-300",
  DONE: "bg-emerald-500/15 text-emerald-300",
};

// Badge colors by payment status.
const PAYMENT_BADGE: Record<PaymentStatus, string> = {
  UNPAID: "bg-red-500/15 text-red-300",
  HALFPAID: "bg-amber-500/15 text-amber-300",
  FULLPAID: "bg-emerald-500/15 text-emerald-300",
};

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

export function PedidosList({ orders }: { orders: Order[] }) {
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
                  <TagPill name={order.tag.name} color={order.tag.color} />
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {order.client.name}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={COLUMN_BADGE[order.column]}
                    label={humanizeEnum(order.column)}
                  />
                </td>
                <td className="text-muted-foreground px-4 py-3 text-right tabular-nums">
                  {order.quantity}
                </td>
                <td className="text-foreground px-4 py-3 text-right font-medium tabular-nums">
                  {currency(order.price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <Badge
                      className={PAYMENT_BADGE[order.status]}
                      label={humanizeEnum(order.status)}
                    />
                    <span className="text-muted-foreground text-xs">
                      {humanizeEnum(order.paymentMethod)}
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
            style={{ borderLeft: `3px solid ${order.tag.color}` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-foreground font-medium break-words">
                  {order.title}
                </div>
                <div className="text-muted-foreground mt-0.5 text-sm break-words">
                  {order.client.name}
                </div>
              </div>
              <span className="text-muted-foreground shrink-0 font-mono text-xs">
                #{order.id}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                className={COLUMN_BADGE[order.column]}
                label={humanizeEnum(order.column)}
              />
              <Badge
                className={PAYMENT_BADGE[order.status]}
                label={humanizeEnum(order.status)}
              />
              <TagPill name={order.tag.name} color={order.tag.color} />
            </div>

            <div className="border-border/60 text-muted-foreground mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t pt-3 text-sm">
              <span>
                Qtde: {order.quantity} · {humanizeEnum(order.paymentMethod)}
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
