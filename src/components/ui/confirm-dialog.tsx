"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

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
  onConfirm: () => void | Promise<void>;
}

/**
 * Confirmation Popup for initerruptive actions (e.g., destructive deletion or unsaved changes warning). 
 * The action only triggers when the confirm button is clicked; closing (Esc, outside click, or cancel) 
 * does not execute anything.
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
            className="hover:cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.confirm}
            disabled={pending}
            onClick={handleConfirm}
            className="hover:cursor-pointer"
          >
            {pending ? "Processando..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
