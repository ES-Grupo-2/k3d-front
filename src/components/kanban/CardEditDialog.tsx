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
 * Modal de edição de card com guarda de alterações não salvas. O formulário
 * só é enviado ao clicar em "Salvar"; ao tentar fechar com modificações
 * pendentes, exibe um aviso antes de descartar.
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

  // Reidrata o formulário com os valores do card sempre que o modal reabre.
  useEffect(() => {
    if (open) form.reset(initialValues);
    // initialValues é estável por card; reset depende apenas da abertura.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSave(values: CardFormData) {
    onSave?.(values);
    form.reset(values); // zera o estado "dirty" após salvar
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

      {/* Guarda: aviso de alterações não salvas ao tentar fechar */}
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
