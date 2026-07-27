"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

// Modal de edição completa de um pedido do Kanban. Permite alterar produto,
// financeiro, categoria, seção e arquivo (o cliente não é editável, pois o
// endpoint PUT /orders/:id não altera o cliente). Salva no backend e propaga
// um patch otimista para a UI. Possui guarda de alterações não salvas.

import { useEffect, useMemo, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";
import { enumPayingMethodMap, humanizeSection } from "@/lib/utils";
import { getTags, type TagResponse } from "@/services/tags";
import type { KanbanTaskStatus, Order } from "@/types/kanban";
import type { UpdateOrderPayload } from "@/types/order";

const SECTION_VALUES: KanbanTaskStatus[] = [
  "PENDENTE",
  "FAZENDO",
  "FINALIZADO",
];

interface EditFormValues {
  title: string;
  tagType: string;
  quantity: number;
  price: number;
  cost: number;
  amount_paid: number;
  payment_method: string;
  section: KanbanTaskStatus;
  archive: string;
  file?: FileList | null;
}

interface CardEditDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (
    orderId: number,
    payload: UpdateOrderPayload,
    localPatch: Partial<Order>,
  ) => Promise<void>;
  isSaving?: boolean;
}

// Monta os valores iniciais do formulário a partir do pedido selecionado.
function toFormValues(order: Order | null): EditFormValues {
  return {
    title: order?.title ?? "",
    tagType: order?.tag?.type ?? "",
    quantity: order?.quantity ?? 1,
    price: order?.price ?? 0,
    cost: order?.cost ?? 0,
    amount_paid: order?.amount_paid ?? 0,
    payment_method: (order?.payment_method as string) ?? "",
    section: order?.section ?? "PENDENTE",
    archive: order?.archive ?? "",
    file: null,
  };
}

export function CardEditDialog({
  open,
  onClose,
  order,
  onSave,
  isSaving,
}: CardEditDialogProps) {
  const initialValues = useMemo(() => toFormValues(order), [order]);
  const form = useForm<EditFormValues>({ defaultValues: initialValues });
  const isDirty = form.formState.isDirty;
  const guard = useUnsavedGuard({ isDirty, onClose });

  const [tags, setTags] = useState<TagResponse[]>([]);

  const currentSection = form.watch("section");
  const currentTagType = form.watch("tagType");

  useEffect(() => {
    if (open) form.reset(initialValues);
  }, [open, form, initialValues]);

  useEffect(() => {
    if (!open) return;
    getTags()
      .then((res) => setTags(Array.isArray(res) ? res : res.data || []))
      .catch((error) =>
        console.error("[CardEditDialog] Erro ao carregar tags:", error),
      );
  }, [open]);

  async function handleSave(values: EditFormValues) {
    if (!order) return;

    const fileToUpload = values.file && values.file.length > 0 ? values.file[0] : undefined;
    const payload: UpdateOrderPayload = {
      title: values.title,
      tagType: values.tagType,
      quantity: Number(values.quantity),
      price: Number(values.price),
      cost: Number(values.cost),
      amount_paid: Number(values.amount_paid),
      payment_method: values.payment_method,
      section: values.section,
      archive: values.archive || undefined,
      file: fileToUpload,
    };

    // Resolve a tag para o patch otimista: mantém a cor atual se a categoria
    // não mudou; caso contrário, usa o id da nova tag (a cor volta no refetch).
    const tagChanged = values.tagType !== order.tag?.type;
    const matchedTag = tags.find((t) => t.type === values.tagType);
    const localPatch: Partial<Order> = {
      title: values.title,
      quantity: payload.quantity,
      price: payload.price,
      cost: payload.cost,
      amount_paid: payload.amount_paid,
      payment_method: values.payment_method,
      section: values.section,
      archive: fileToUpload ? fileToUpload.name : (values.archive || undefined),
      tag: tagChanged
        ? {
            id: matchedTag?.id ?? order.tag?.id,
            type: values.tagType,
            color: undefined,
          }
        : order.tag,
    };

    await onSave(order.id, payload, localPatch);
    form.reset(values);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={guard.handleOpenChange}>
        <DialogContent size="2xl">
          <DialogHeader>
            <DialogTitle>Editar pedido</DialogTitle>
            <DialogDescription>
              As alterações só são salvas ao clicar em “Salvar”. O cliente não
              pode ser alterado.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="mt-4 flex flex-col gap-2"
          >
            <div className="grid max-h-[65vh] grid-cols-1 gap-6 overflow-y-auto pr-2 pb-2 sm:grid-cols-2">
              <div className="space-y-6">
                <div className="border-border/50 space-y-4 rounded-xl border p-4">
                  <h3 className="text-foreground text-sm font-semibold">
                    Detalhes do Produto
                  </h3>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-title">Título do Pedido</Label>
                    <Input
                      id="edit-title"
                      {...form.register("title", { required: true })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Tag / Categoria</Label>
                      <Select
                        value={currentTagType}
                        onValueChange={(val) =>
                          form.setValue("tagType", val, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger className="hover:cursor-pointer">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {tags.map((t) => (
                            <SelectItem
                              key={t.id}
                              value={String(t.type)}
                              className="hover:cursor-pointer"
                            >
                              {t.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="edit-quantity">Quantidade</Label>
                      <Input
                        id="edit-quantity"
                        type="number"
                        min="1"
                        {...form.register("quantity", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Seção do Kanban</Label>
                    <Select
                      value={currentSection}
                      onValueChange={(val) =>
                        form.setValue("section", val as KanbanTaskStatus, {
                          shouldDirty: true,
                        })
                      }
                    >
                      <SelectTrigger className="hover:cursor-pointer">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTION_VALUES.map((value) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="hover:cursor-pointer"
                          >
                            {humanizeSection(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-border/50 space-y-4 rounded-xl border p-4">
                  <Label>Cliente (não editável)</Label>
                  <p className="text-muted-foreground text-sm">
                    {order?.client?.name}
                    {order?.client?.phone ? ` · ${order.client.phone}` : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-border/50 space-y-4 rounded-xl border p-4">
                  <h3 className="text-foreground text-sm font-semibold">
                    Financeiro
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-price">Preço Total (R$)</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        step="0.01"
                        {...form.register("price", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-cost">Custo (R$)</Label>
                      <Input
                        id="edit-cost"
                        type="number"
                        step="0.01"
                        {...form.register("cost", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-amount-paid">Valor Pago (R$)</Label>
                      <Input
                        id="edit-amount-paid"
                        type="number"
                        step="0.01"
                        {...form.register("amount_paid", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Método</Label>
                      <Select
                        value={form.watch("payment_method")}
                        onValueChange={(val) =>
                          form.setValue("payment_method", val, {
                            shouldDirty: true,
                          })
                        }
                      >
                        <SelectTrigger className="hover:cursor-pointer">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(enumPayingMethodMap)
                            .filter(([method]) => method !== "None")
                            .map(([method, label]) => (
                              <SelectItem
                                key={method}
                                value={method}
                                className="hover:cursor-pointer"
                              >
                                {label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="border-border space-y-4 rounded-xl border border-dashed p-4">
                  <h3 className="text-foreground text-sm font-semibold">
                    Anexos
                  </h3>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-file">Enviar novo arquivo</Label>
                    <Input
                      id="edit-file"
                      type="file"
                      className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:rounded-sm file:mr-4 file:px-4 file:py-1 hover:file:bg-primary/20"
                      {...form.register("file")}
                    />
                  </div>

                  <div className="flex items-center justify-center text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    ou
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-archive">
                      Link Externo
                    </Label>
                    <Input
                      id="edit-archive"
                      placeholder="https://..."
                      {...form.register("archive")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="border-border border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => guard.handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!isDirty || isSaving}>
                {isSaving ? "Salvando..." : "Salvar"}
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
