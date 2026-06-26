"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components/ui";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";

export interface CardFormData {
  title: string;
  description: string;
}

interface CardEditDialogProps {
  open: boolean;
  onClose: () => void;
  initialValues: CardFormData;
  onSave?: (data: CardFormData) => void;
}

/**
 * Edit PopUp for Kanban cards with unsaved changes guard. 
 * The form is only submitted when clicking "Save".
 * Attempting to close with pending modifications will show a warning before discarding.
 */
export function CardEditDialog({
  open,
  onClose,
  initialValues,
  onSave,
}: CardEditDialogProps) {
  const form = useForm<CardFormData>({ defaultValues: initialValues });
  const isDirty = form.formState.isDirty;
  const guard = useUnsavedGuard({ isDirty, onClose });

  useEffect(() => {
    if (open) form.reset(initialValues);
  }, [open]);

  function handleSave(values: CardFormData) {
    onSave?.(values);
    form.reset(values);
    onClose();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={guard.handleOpenChange}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Editar card</DialogTitle>
            <DialogDescription>
              As alterações só são salvas ao clicar em “Salvar”.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="mt-4 space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="card-title">Título</Label>
              <Input id="card-title" {...form.register("title")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="card-description">Descrição</Label>
              <textarea
                id="card-description"
                rows={4}
                className="border-secondary placeholder:text-muted-foreground/50 focus:border-primary w-full resize-none rounded-md border bg-transparent px-4 py-2 text-sm outline-none"
                {...form.register("description")}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => guard.handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!isDirty}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={guard.warnOpen}
        onOpenChange={guard.setWarnOpen}
        tone="warning"
        title="Descartar alterações?"
        description="Alterações não salvas serão perdidas. Deseja sair?"
        confirmLabel="Sair sem salvar"
        cancelLabel="Continuar editando"
        onConfirm={guard.discard}
      />
    </>
  );
}
