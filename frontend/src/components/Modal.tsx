/**
 * @file Modal genérico controlado (open/close vem do pai). Apresenta um
 * backdrop semitransparente, fecha ao clicar fora ou no botão "✕" e suporta
 * largura configurável via prop `width`.
 * @author lukasnascimento1
 */
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
};

/**
 * Janela modal reutilizável. Não toma decisões sobre o conteúdo — apenas
 * renderiza um painel centralizado com cabeçalho, botão de fechar e área
 * filha (`children`).
 *
 * Comportamentos:
 * - Não renderiza nada se `open === false` (retorno antecipado, evita custo
 *   de portal/renderização inútil).
 * - Clique no backdrop dispara `onClose`.
 * - Clique dentro do painel é "parado" via `stopPropagation` para não fechar.
 *
 * **Onde é usado:** `KanbanPage` (criar/editar pedido), `ClientsPage`
 * (criar/editar cliente) e `TagsPage` (criar/editar categoria).
 *
 * @param open - controla a visibilidade
 * @param title - texto exibido no cabeçalho
 * @param onClose - callback disparado ao fechar (botão ou backdrop)
 * @param children - conteúdo (geralmente um formulário)
 * @param width - classe Tailwind de largura máxima (default: `max-w-lg`)
 */
export function Modal({ open, title, onClose, children, width = "max-w-lg" }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className={`panel w-full ${width} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground">
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
