// Tabela de detalhamento por produto. Na variante "financial" mostra receita,
// custo, lucro e margem (com linha de totais); na "operational" foca em pedidos
// e quantidade. Compartilhada entre os dois dashboards.
// Author: lukasnascimento1
import { currency } from "@/lib/utils";
import type { ProductBreakdown } from "@/schemas/dashboard";

interface ProductsTableProps {
  products: ProductBreakdown[];
  variant: "financial" | "operational";
}

export function ProductsTable({ products, variant }: ProductsTableProps) {
  const isFinancial = variant === "financial";

  // Totais exibidos no rodapé da variante financeira.
  const totals = products.reduce(
    (acc, product) => ({
      revenue: acc.revenue + product.revenue,
      cost: acc.cost + product.cost,
      profit: acc.profit + product.profit,
    }),
    { revenue: 0, cost: 0, profit: 0 },
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-border border-b text-left">
            <th className="px-3 py-2 font-medium">Produto</th>
            <th className="px-3 py-2 font-medium">Categoria</th>
            <th className="px-3 py-2 text-right font-medium">Pedidos</th>
            <th className="px-3 py-2 text-right font-medium">Qtd</th>
            {isFinancial && (
              <>
                <th className="px-3 py-2 text-right font-medium">Receita</th>
                <th className="px-3 py-2 text-right font-medium">Custo</th>
                <th className="px-3 py-2 text-right font-medium">Lucro</th>
                <th className="px-3 py-2 text-right font-medium">Margem</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.name}
              className="border-border/50 border-b last:border-0"
            >
              <td className="px-3 py-2 font-medium">{product.name}</td>
              <td className="px-3 py-2">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: product.tagColor }}
                  />
                  <span className="text-muted-foreground">
                    {product.tagName}
                  </span>
                </span>
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {product.orders}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {product.quantity}
              </td>
              {isFinancial && (
                <>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {currency(product.revenue)}
                  </td>
                  <td className="text-muted-foreground px-3 py-2 text-right tabular-nums">
                    {currency(product.cost)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-emerald-500">
                    {currency(product.profit)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {product.profitMarginPercent.toFixed(1)}%
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
        {isFinancial && (
          <tfoot>
            <tr className="border-border border-t font-medium">
              <td className="px-3 py-2" colSpan={4}>
                Total
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {currency(totals.revenue)}
              </td>
              <td className="text-muted-foreground px-3 py-2 text-right tabular-nums">
                {currency(totals.cost)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-emerald-500">
                {currency(totals.profit)}
              </td>
              <td className="px-3 py-2" />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
