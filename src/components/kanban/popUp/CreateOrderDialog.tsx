"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { UploadCloud, UserPlus, Users, Search } from "lucide-react";
import { Client, OrderFormData } from "@/types/order";
import { enumPayingMethodMap } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"; 
import { getClients } from "@/services/order/order";
import { getTags, TagResponse } from "@/services/tags";
import { AlertDialog } from "@/components/ui/alert-dialog";

interface CreateOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: OrderFormData) => Promise<void>;
  isLoading: boolean;
}

export function CreateOrderDialog({ open, onClose, onSave, isLoading }: CreateOrderDialogProps) {
  const { register, handleSubmit, setValue, control } = useForm<OrderFormData>({
    defaultValues: {
      newClientName: "",
      newClientPhone: "",
      title: "",
      archive: "",
      price: undefined, 
      cost: undefined,
      amount_paid: 0,
      quantity: 1,
    }
  });
  
  const [clientMode, setClientMode] = useState<"EXISTING" | "NEW">("EXISTING");
  
  const [clients, setClients] = useState<Client[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);
  
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState("");

  const selectedClientId = useWatch({
    control,
    name: "clientId",
  });

  const [alert, setAlert] = useState<string | null>(null);

  const onSubmit = async (data: OrderFormData) => {
    if (!data.title?.trim()) {
      return setAlert("O título do pedido é obrigatório.");
    }
    if (!data.tagType) {
      return setAlert("Por favor, selecione uma tag/categoria.");
    }
    if (!data.quantity || data.quantity < 1) {
      return setAlert("A quantidade do pedido deve ser de pelo menos 1.");
    }

    if (clientMode === "NEW") {
      const newName = data.newClientName?.trim();
      const newPhone = data.newClientPhone?.trim();

      if (!newName) {
        return setAlert("O nome do cliente é obrigatório para um novo cadastro.");
      }

      const clientExists = clients.some(c => {
        const nameMatches = c.name?.toLowerCase() === newName.toLowerCase();
        const phoneMatches = c.phone && newPhone && c.phone === newPhone;
        return nameMatches || phoneMatches;
      });

      if (clientExists) {
        return setAlert("Um cliente com este exato nome ou telefone já existe na aba 'Cadastrado'\nBusque-o ou crie um novo.");
      }
    } else {
      if (!data.clientId) {
        return setAlert("Por favor, selecione um cliente da lista ou mude para a aba 'Novo'.");
      }
    }

    if (data.amount_paid < 0) {
      return setAlert("O valor pago não pode ser negativo.");
    }

    if(data.price !== undefined && data.price < 0) {
      return setAlert("Insira um preço válido.");
    }

    if (data.price !== undefined && data.amount_paid > data.price) {
      return setAlert("O valor pago não pode ser maior que o preço do produto.");
    }

    if (!data.payment_method || data.payment_method === "None") {
      return setAlert("Por favor, selecione um método de pagamento obrigatório.");
    }

    if (!data.file && data.archive === ""){
      return setAlert("Por favor, selecione um arquivo ou insira um link externo.");
    }
    await onSave(data);
  };
  
  useEffect(() => {
    const carregarDadosAuxiliares = async () => {
      setIsLoadingData(true);
      try {
        const [clientsRes, tagsRes] = await Promise.all([getClients(), getTags()]);
        setClients(clientsRes.data || []);
        setTags(Array.isArray(tagsRes) ? tagsRes : tagsRes.data || []);
      } catch (error) {
        console.error("[CreateOrderDialog] Erro ao carregar dados auxiliares:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (open) {
      carregarDadosAuxiliares();
      setTimeout(() => {
        setClientSearchTerm(""); 
      }, 0);
    }
  }, [open]);

  const filteredClients = clients.filter(c => {
    const term = clientSearchTerm.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(term);
    const phoneMatch = c.phone?.toLowerCase().includes(term);
    return nameMatch || phoneMatch;
  });

  return (
    alert ? (
      <div>
        <AlertDialog
          open={alert !== null}
          onOpenChange={(open) => {
            if (!open) setAlert(null);
          }}
          tone="destructive"
          title="Atenção!"
          message={alert}
          confirmLabel="Fechar"
          onConfirm={() => setAlert(null)}
        />
      </div>
    ) : (
    <Dialog open={open} onOpenChange={(isOpen) => !isLoading && !isOpen && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogDescription>Preencha os dados de produção, financeiro e cliente.</DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-6">
                
                <div className="space-y-4 rounded-xl border border-border/50 bg-muted/10 p-4">
                  <h3 className="text-sm font-semibold text-foreground">Detalhes do Produto</h3>
                  
                  <div className="space-y-1.5">
                    <Label>Título do Pedido</Label>
                    <Input placeholder="Ex: Lote de Chaveiros" {...register("title")} />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Tag / Categoria</Label>
                    <Select onValueChange={(val) => setValue("tagType", val, {shouldValidate: true})}>
                      <SelectTrigger className="hover:cursor-pointer" disabled={isLoadingData}>
                        <SelectValue placeholder={isLoadingData ? "Carregando..." : "Selecione"} />
                      </SelectTrigger>
                      <SelectContent>
                        {tags.map(t => <SelectItem className="hover:cursor-pointer" key={t.id} value={t.type}>{t.type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Quantidade</Label>
                    <Input type="number" min="1" defaultValue="1" {...register("quantity", { valueAsNumber: true })} />
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
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder={isLoadingData ? "Carregando clientes..." : "Buscar por nome ou telefone..."} 
                          className="pl-9"
                          value={clientSearchTerm}
                          onChange={(e) => setClientSearchTerm(e.target.value)}
                          disabled={isLoadingData}
                        />
                      </div>
                      
                      <div className="max-h-40 overflow-y-auto space-y-1 pr-1 border border-border/50 rounded-md p-1 bg-muted/20">
                        {filteredClients.length > 0 ? (
                          filteredClients.map(c => (
                            <div 
                              key={c.id} 
                              onClick={() => setValue("clientId", c.id, { shouldValidate: true })}
                              className={`flex flex-col p-2.5 rounded-md cursor-pointer transition-colors border ${
                                selectedClientId === c.id 
                                  ? "bg-primary/10 border-primary text-primary" 
                                  : "bg-background border-transparent hover:border-border hover:bg-muted"
                              }`}
                            >
                              <span className="text-sm font-medium leading-none">{c.name}</span>
                              <span className="text-xs text-muted-foreground mt-1.5">{c.phone || "Sem telefone"}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            Nenhum cliente encontrado.
                          </div>
                        )}
                      </div>
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
                      <Label>Método <span className="text-red-500">*</span></Label>
                      <Select onValueChange={(val) => setValue("payment_method", val, {shouldValidate: true})}>
                        <SelectTrigger className="hover:cursor-pointer"><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(enumPayingMethodMap).filter(([payMethod]) => payMethod !== "None").map(([payMethod, label]) => (
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
          </div>

          <div className="px-6 py-4 border-t border-border mt-auto bg-background rounded-b-lg">
            <div className="flex justify-end gap-2">
              <Button type="button" className="hover:cursor-pointer" variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" className="hover:cursor-pointer" disabled={isLoading}>
                {isLoading ? "Criando Pedido..." : "Salvar Pedido"}
              </Button>
            </div>
          </div>

        </form>
      </DialogContent>
    </Dialog>
    )
  );
}