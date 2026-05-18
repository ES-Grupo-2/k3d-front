/**
 * @file Modal genérico controlado, com painel translúcido `.ep-glass` e
 * backdrop blur — estilo EyePleasure.
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

export function Modal({ open, title, onClose, children, width = "max-w-lg" }: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8, 8, 15, 0.8)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className={`ep-glass w-full ${width} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-base text-foreground tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
