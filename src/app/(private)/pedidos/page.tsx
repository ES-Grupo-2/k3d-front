/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import { SECTIONS, PAYMENT_METHODS } from "@/services/orders";
import { queryOrders } from "@/services/orders";
import { getTags } from "@/services/tags";
import PedidosClient from "@/components/pedidos/PedidosClient";

export const dynamic = 'force-dynamic';

function parseEnumParam<T extends string>(
  value: string | undefined,
  allowed: T[],
): T | "" {
  return value && (allowed as string[]).includes(value) ? (value as T) : "";
}

export default async function PedidosPage(
  {searchParams}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }) {
  const tags = await getTags();
  const params = await searchParams;

  const orderQuery = typeof params.search === "string" ? params.search : "";

  const section = parseEnumParam(
    typeof params.section === "string" ? params.section : undefined,
    SECTIONS,
  );
  
  const paymentMethod = parseEnumParam(
    typeof params.payment === "string" ? params.payment : undefined,
    PAYMENT_METHODS,
  );
  
  const page = typeof params.page === "string" ? params.page : "1";

  const initialOrders = await queryOrders({
    queryInput: orderQuery, 
    section: section || undefined,
    payment: paymentMethod || undefined,
    page: page,
  });

  return (
    <main>
      <PedidosClient 
        key={`${orderQuery}-${section}-${paymentMethod}-${page}`}
        initialOrders={initialOrders.data}
        metaItemsQuantity={initialOrders.meta.totalItems}
        tags={tags} 
        queryInputParam={orderQuery} 
        sectionParam={section} 
        paymentMethodParam={paymentMethod}
      />
    </main>
  );
}