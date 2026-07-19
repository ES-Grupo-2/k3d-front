"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UploadCloud, UserPlus, Users } from "lucide-react";
import { Client, OrderFormData } from "@/types/order";
import { enumPayingMethodMap } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"; 
import { getClients } from "@/services/order/order";
import { getTags, TagResponse } from "@/services/tags";

interface CreateOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: OrderFormData) => Promise<void>;
  isLoading: boolean;
}

export function CreateOrderDialog({ open, onClose, onSave, isLoading }: CreateOrderDialogProps) {
  const { register, handleSubmit, setValue } = useForm<OrderFormData>();
  const [clientMode, setClientMode] = useState<"EXISTING" | "NEW">("EXISTING");
  const [clients, setClients] = useState<Client[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const onSubmit = async (data: OrderFormData) => {
    await onSave(data);
  };

  /**
   * Fetches clients and tags simultaneously when the dialog is opened
   */
  useEffect(() => {
    if (open) {
      setIsLoadingData(true);
      
      Promise.all([getClients(), getTags()])
        .then(([clientsRes, tagsRes]) => {
          setClients(clientsRes.data || []);
          setTags(Array.isArray(tagsRes) ? tagsRes : tagsRes.data || []);
        })
        .catch((error) => console.error("[CreateOrderDialog] Erro ao carregar dados auxiliares:", error))
        .finally(() => setIsLoadingData(false));
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isLoading && !isOpen && onClose()}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
          <DialogDescription>Preencha os dados de produção, financeiro e cliente.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto max-h-[65vh] pr-2 pb-2">
          <div className="space-y-6">
            <div className="space-y-4 rounded-xl border border-border/50 bg-muted/10 p-4">
              <h3 className="text-sm font-semibold text-foreground">Detalhes do Produto</h3>
              <div className="space-y-1.5">
                <Label>Título do Pedido</Label>
                <Input placeholder="Ex: Lote de Chaveiros" {...register("title", { required: true })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Tag / Categoria</Label>
                  <Select onValueChange={(val) => setValue("tagType", val, {shouldValidate: true})}>
                    <SelectTrigger className="hover:cursor-pointer">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map(t => <SelectItem className="hover:cursor-pointer" key={t.id} value={String(t.type)}>{t.type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Quantidade</Label>
                  <Input type="number" min="1" defaultValue="1" {...register("quantity", { valueAsNumber: true })} />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Cliente</h3>
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                  <button type="button" onClick={() => setClientMode("EXISTING")} className={`rounded-md px-3 py-1 text-xs font-medium transition-colors hover:cursor-pointer ${clientMode === "EXISTING" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}><Users className="inline mr-1.5 size-3"/>Cadastrado</button>
                  <button type="button" onClick={() => setClientMode("NEW")} className={`rounded-md px-3 py-1 text-xs font-medium transition-colors hover:cursor-pointer ${clientMode === "NEW" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}><UserPlus className="inline mr-1.5 size-3"/>Novo</button>
                </div>
              </div>

              {clientMode === "EXISTING" ? (
                <div className="space-y-1.5">
                  <Label>Selecionar Cliente</Label>
                  <Select onValueChange={(val) => setValue("clientId", val)}>
                    <SelectTrigger className="hover:cursor-pointer"><SelectValue placeholder="Busque um cliente..." /></SelectTrigger>
                    <SelectContent>
                      {clients.map(c => <SelectItem className="hover:cursor-pointer" key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <Label>Nome do Novo Cliente</Label>
                    <Input placeholder="Nome completo ou Empresa" {...register("newClientName")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Telefone / WhatsApp</Label>
                    <Input placeholder="(00) 00000-0000" {...register("newClientPhone")} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4 rounded-xl border border-border/50 bg-muted/10 p-4">
              <h3 className="text-sm font-semibold text-foreground">Financeiro</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Preço Total (R$)</Label>
                  <Input type="number" step="0.01" placeholder="0.00" {...register("price", { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Custo Estimado (R$)</Label>
                  <Input type="number" step="0.01" placeholder="0.00" {...register("cost", { valueAsNumber: true })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Valor Pago (R$)</Label>
                  <Input type="number" step="0.01" defaultValue="0" {...register("amount_paid", { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Método</Label>
                  <Select onValueChange={(val) => setValue("payment_method", val)}>
                    <SelectTrigger className="hover:cursor-pointer"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(enumPayingMethodMap).filter(([payMethod, _]) => payMethod !== "None").map(([payMethod, label]) => (
                        <SelectItem key={payMethod} className="hover:cursor-pointer" value={payMethod}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-dashed border-border p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <UploadCloud className="size-4" />
                Arquivos do Pedido
              </div>
              
              <div className="space-y-1.5">
                <Label>Arquivo Modelo / GCODE</Label>
                <Input type="file" className="cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-1 hover:file:bg-primary/20" {...register("file")} />
                <p className="text-[10px] text-muted-foreground mt-1">Stl, Obj, Gcode ou ZIP (Max 50MB)</p>
              </div>

              <div className="space-y-1.5">
                <Label>Link Externo (Drive/Thingiverse)</Label>
                <Input placeholder="https://..." {...register("archive")} />
              </div>
            </div>
          </div>
        </div>

          <DialogFooter className="col-span-1 md:col-span-2 border-t border-border pt-6">
            <Button type="button" className="hover:cursor-pointer" variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
            <Button type="submit" className="hover:cursor-pointer" disabled={isLoading}>
              {isLoading ? "Criando Pedido..." : "Salvar Pedido"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}