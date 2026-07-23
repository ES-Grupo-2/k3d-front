/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import { useDraggable, useDndContext } from "@dnd-kit/core";
import { Order } from "@/types/kanban";
import { currency, humanizePayMethod, humanizePayStatus } from "@/lib/utils";
import { forwardRef, useState } from "react";
import {
  ChevronDown,
  CreditCard,
  Edit2,
  Paperclip,
  Trash,
  Package,
  User,
} from "lucide-react";

interface KanbanCardProps {
  order: Order;
  onEdit: () => void;
  onDelete: () => void;
  isManager: boolean;
  isOverlay?: boolean;
  isDestinationPlaceHolder?: boolean;
}

export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(
  function KanbanCard(
    {
      order,
      onEdit,
      onDelete,
      isManager,
      isOverlay,
      isDestinationPlaceHolder,
    }: KanbanCardProps,
    ref,
  ) {
    // Ao clicar/tocar, um segundo card (mais escuro) surge por baixo do principal.
    const [expanded, setExpanded] = useState(false);

    const draggableId = isDestinationPlaceHolder
      ? `ghost-${order.id}`
      : order.id;
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: draggableId,
        data: { originColumn: order.section, order: order },
      });

    const { over } = useDndContext();

    const style =
      transform && isOverlay
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    const isOriginalCard = isDragging && !isOverlay;
    const isCardOverOtherColumn = over && over.id !== order.section;

    const isPlaceholder = isOriginalCard || isDestinationPlaceHolder;

    if (isOriginalCard && isCardOverOtherColumn) {
      return <div ref={setNodeRef} className="hidden" />;
    }

    const formattedTitle = order.title[0].toUpperCase() + order.title.slice(1);

    const file = order.archive?.trim();
    const isFileLink = !!file && /^https?:\/\//i.test(file);

    return (
      <div
        ref={isOverlay ? ref : setNodeRef}
        style={style}
        {...(isOverlay || isPlaceholder ? {} : listeners)}
        {...(isOverlay || isPlaceholder ? {} : attributes)}
        onClick={
          isOverlay || isPlaceholder
            ? undefined
            : () => setExpanded((prev) => !prev)
        }
        suppressHydrationWarning={true}
        className={`k3d-kanban-card relative text-sm ${
          isDragging ? "touch-none opacity-50" : "touch-pan-y"
        } ${
          isOverlay || isPlaceholder
            ? "cursor-grabbing"
            : "cursor-grab active:cursor-grabbing"
        }`}
      >
        {/* Card principal — estático (não cresce ao expandir). Fica na frente
            (z-10) para cobrir o topo do card de detalhes que surge por trás. */}
        <div
          className={`relative z-10 overflow-hidden rounded-md transition-colors ${
            isOverlay
              ? "bg-card border border-border ring-primary scale-105 rotate-3 opacity-90 shadow-2xl ring-2"
              : isPlaceholder
                ? "bg-border/20 border-border border-2 border-dashed opacity-50"
                : "bg-card border border-border hover:border-primary/50 shadow-sm"
          }`}
        >
          <div
            className="absolute left-0 top-0 h-full w-1"
            style={{ backgroundColor: order.tag?.color || '#777' }}
          />

          <div className={`flex flex-col gap-3 p-4 pl-5 ${isPlaceholder ? "invisible" : "visible"}`}>
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold tracking-wider text-foreground/80 uppercase">
                {order.tag?.type}
              </span>

              <div className="flex items-center gap-1">
                {isManager && (
                  <div className="flex items-center gap-1 opacity-60 transition-opacity hover:opacity-100">
                    <button
                      className="rounded p-1 text-muted-foreground hover:cursor-pointer hover:bg-foreground/10 hover:text-foreground transition-all"
                      onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="rounded p-1 text-muted-foreground hover:cursor-pointer hover:bg-red-500/10 hover:text-red-400 transition-all"
                      onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                )}
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-medium leading-tight text-foreground">
                {formattedTitle}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User size={14} className="shrink-0" />
                <span className="truncate">{order.client?.name}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Package size={14} />
                  <span>{order.quantity || 1} un</span>
                </div>
                <div className="font-medium text-foreground/90">
                  {currency(order.price)}
                </div>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CreditCard size={14} />
                <span>{humanizePayMethod(order.payment_method || "None")}</span>
              </div>

              <span className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wide ${
                order.amount_paid >= order.price
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {humanizePayStatus(order.amount_paid || 0, order.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Card de detalhes — "novo card" que surge por trás do principal, mais
            escuro. O recuo negativo (-mt-2) + z-0 fazem o topo ficar tucado atrás
            do card principal, sem gap. Só em cards reais. */}
        {!isOverlay && !isPlaceholder && (
          <div
            className={`relative z-0 -mt-4 grid transition-[grid-template-rows] duration-300 ease-out ${
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="k3d-kanban-card-details space-y-2 rounded-b-md border border-t-0 border-border px-3 pb-3 pt-6 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Telefone</span>
                  <span className="text-foreground/90 truncate">
                    {order.client?.phone || "—"}
                  </span>
                </div>

                {order.client?.email ? (
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">E-mail</span>
                    <span className="text-foreground/90 truncate">
                      {order.client.email}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Custo</span>
                  <span className="text-foreground/90">
                    {order.cost != null ? currency(order.cost) : "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Valor pago</span>
                  <span className="text-foreground/90">
                    {currency(order.amount_paid)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Arquivo</span>
                  {file ? (
                    isFileLink ? (
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary inline-flex items-center gap-1 truncate underline underline-offset-2"
                      >
                        <Paperclip size={12} className="shrink-0" />
                        Abrir
                      </a>
                    ) : (
                      <span className="text-foreground/90 inline-flex max-w-[60%] items-center gap-1 truncate">
                        <Paperclip size={12} className="shrink-0" />
                        {file}
                      </span>
                    )
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
);

KanbanCard.displayName = "KanbanCard";
