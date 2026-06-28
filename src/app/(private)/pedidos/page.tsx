import { PackageSearch } from "lucide-react";

import { PedidosFilters, PedidosList } from "@/components/pedidos";
import { queryOrders } from "@/data/orders";
import { requireAuth } from "@/services/auth/session";
import type { KanbanColumnNames, PaymentMethod } from "@/types/kanban";

// Tela de histórico/listagem de pedidos.
// Server Component: lê os filtros direto de `searchParams`, busca a lista já
// filtrada no servidor e a entrega para renderização. A interatividade fica
// isolada em `PedidosFilters`, que apenas reescreve a URL.

const COLUMNS: KanbanColumnNames[] = ["TODO", "DOING", "DONE"];
const PAYMENT_METHODS: PaymentMethod[] = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "CASH",
  "PIX",
];

// Garante que só valores válidos do enum cheguem ao filtro (ignora lixo na URL).
function pick<T extends string>(
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

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const column = pick(
    typeof sp.status === "string" ? sp.status : undefined,
    COLUMNS,
  );
  const paymentMethod = pick(
    typeof sp.payment === "string" ? sp.payment : undefined,
    PAYMENT_METHODS,
  );

  const orders = await queryOrders({
    q,
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
        initialQuery={q}
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
