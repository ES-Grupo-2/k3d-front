import { PackageSearch } from "lucide-react";

import { PedidosFilters, PedidosList } from "@/components/pedidos";
import { queryOrders } from "@/data/orders";
import { requireAuth } from "@/services/auth/session";
import type { KanbanTaskStatus, PaymentMethod } from "@/types/kanban";

// Orders history/listing screen.
// Server Component: reads the filters straight from `searchParams`, fetches the
// already-filtered list on the server and hands it off for rendering. All the
// interactivity is isolated in `PedidosFilters`, which only rewrites the URL.

const COLUMNS: KanbanTaskStatus[] = ["PENDENTE", "FAZENDO", "FINALIZADO"];
const PAYMENT_METHODS: PaymentMethod[] = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "CASH",
  "PIX",
];

// Ensures only valid enum values reach the filter (ignores junk in the URL).
function parseEnumParam<T extends string>(
  value: string | undefined,
  allowed: T[],
): T | "" {
  return value && (allowed as string[]).includes(value) ? (value as T) : "";
}

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const orderQuery = typeof params.q === "string" ? params.q : "";
  const column = parseEnumParam(
    typeof params.status === "string" ? params.status : undefined,
    COLUMNS,
  );
  const paymentMethod = parseEnumParam(
    typeof params.payment === "string" ? params.payment : undefined,
    PAYMENT_METHODS,
  );

  const orders = await queryOrders({
    q: orderQuery,
    column: column || undefined,
    paymentMethod: paymentMethod || undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <p className="text-muted-foreground text-sm">
          Histórico completo de pedidos — busque, filtre e audite a operação.
        </p>
      </header>

      <PedidosFilters
        initialQuery={orderQuery}
        initialColumn={column}
        initialPayment={paymentMethod}
      />

      <p className="text-muted-foreground text-sm">
        {orders.length}{" "}
        {orders.length === 1 ? "pedido encontrado" : "pedidos encontrados"}
      </p>

      {orders.length > 0 ? (
        <PedidosList orders={orders} />
      ) : (
        <div className="border-border text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <PackageSearch className="size-8 opacity-60" />
          <div>
            <p className="text-foreground font-medium">
              Nenhum pedido encontrado
            </p>
            <p className="text-sm">
              Ajuste a busca ou os filtros para ver outros resultados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
