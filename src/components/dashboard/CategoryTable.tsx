// Tabela de detalhamento por categoria do dashboard operacional. Lista cada
// categoria com a quantidade de pedidos e sua participação (%) no total.
// Author: lukasnascimento1
import type { OperationalDashboardData } from "@/schemas/dashboard/dashboard";

interface CategoryTableProps {
  categories: OperationalDashboardData["byCategory"];
  totalOrders: number;
}

export function CategoryTable({ categories, totalOrders }: CategoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-border border-b text-left">
            <th className="px-3 py-2 font-medium">Categoria</th>
            <th className="px-3 py-2 text-right font-medium">Pedidos</th>
            <th className="px-3 py-2 text-right font-medium">% do total</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const share =
              totalOrders > 0 ? (category.total / totalOrders) * 100 : 0;

            return (
              <tr
                key={category.tagId}
                className="border-border/50 border-b last:border-0"
              >
                <td className="px-3 py-2">
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </span>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {category.total}
                </td>
                <td className="text-muted-foreground px-3 py-2 text-right tabular-nums">
                  {share.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
