import { PackageSearch } from "lucide-react";
import { PedidosFilters, PedidosList } from "@/components/pedidos";
import { queryOrders } from "@/services/orders"; 

// Orders history/listing screen.
// Server Component: reads the filters straight from `searchParams`, fetches the
// already-filtered list on the server and hands it off for rendering. All the
// interactivity is isolated in `PedidosFilters`, which only rewrites the URL.

const SECTIONS = ["PENDENTE", "FAZENDO", "FINALIZADO"];
const PAYMENT_METHODS = ["CREDIT_CARD", "DEBIT_CARD", "CASH", "PIX", "None"];

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
  const params = await searchParams;
  const orderQuery = typeof params.queryInput === "string" ? params.queryInput : "";
  
  const section = parseEnumParam(
    typeof params.section === "string" ? params.section : undefined,
    SECTIONS,
  );
  const paymentMethod = parseEnumParam(
    typeof params.payment === "string" ? params.payment : undefined,
    PAYMENT_METHODS,
  );
  
  const page = typeof params.page === "string" ? params.page : "1";

  const response = await queryOrders({
    queryInput: orderQuery,
    section: section || undefined,
    payment: paymentMethod || undefined,
    page: page,
  });

  const orders = response.data;
  const totalItems = response.meta.totalItems;
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
        initialSection={section}
        initialPayment={paymentMethod}
      />

      <p className="text-muted-foreground text-sm">
        {totalItems}{" "}
        {totalItems === 1 ? "pedido encontrado" : "pedidos encontrados"}
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