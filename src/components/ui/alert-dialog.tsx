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
  message: React.ReactNode;
  confirmLabel?: string;
  tone?: ConfirmTone;
  onConfirm: () => void | Promise<void>;
}

/**
 *  The Alert Dialog is used as a warning pop-up to guide user actions through forms and other interfaces.
 *  @author jvs-neves 
*/
export function AlertDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = "Confirmar",
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
            {message ? (
              <DialogDescription>{message}</DialogDescription>
            ) : null}
          </DialogHeader>
        </div>

        <DialogFooter>
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
