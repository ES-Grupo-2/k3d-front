"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

type ConfirmTone = "destructive" | "warning" | "default";

const TONE: Record<
  ConfirmTone,
  { icon: string; confirm: React.ComponentProps<typeof Button>["variant"] }
> = {
  destructive: {
    icon: "text-destructive bg-destructive/10",
    confirm: "destructive",
  },
  warning: { icon: "text-primary bg-primary/10", confirm: "default" },
  default: { icon: "text-primary bg-primary/10", confirm: "default" },
};

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  /** Ação positiva. Se retornar Promise, exibe estado de carregamento. */
  onConfirm: () => void | Promise<void>;
}

/**
 * PopUp de confirmação para ações interruptivas (ex.: exclusão destrutiva ou
 * aviso de alterações não salvas). A ação só dispara ao clicar no botão de
 * confirmação; fechar (Esc, clique-fora ou cancelar) não executa nada.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = React.useState(false);
  const config = TONE[tone];

  async function handleConfirm() {
    try {
      setPending(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" showClose={false}>
        <div className="flex gap-4">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full",
              config.icon,
            )}
          >
            <AlertTriangle className="size-5" />
          </span>
          <DialogHeader className="pr-0">
            <DialogTitle>{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : null}
          </DialogHeader>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.confirm}
            disabled={pending}
            onClick={handleConfirm}
          >
            {pending ? "Processando..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
