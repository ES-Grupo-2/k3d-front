"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components/ui";
import { createTag } from "@/services/tags"; 
import { Tag } from "@/types/tags";


interface CreateTagFormValues {
  type: string;
  color: string;
}

interface CreateTagDialogProps {
  open: boolean;
  onClose: () => void;
  onTagCreated: (newTag: Tag) => void;
}

export function CreateTagDialog({
  open,
  onClose,
  onTagCreated,
}: CreateTagDialogProps) {
  const form = useForm<CreateTagFormValues>({
    defaultValues: {
      type: "",
      color: "#6366f1",
    },
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSave = async (values: CreateTagFormValues) => {
    if (!values.type.trim()) return;

    setIsCreating(true);
    try {
      const newTag = await createTag({
        type: values.type.trim(),
        color: values.color,
      });

      onTagCreated(newTag);
      handleClose();
      
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message); 
      } else {
        alert("Ocorreu um erro desconhecido ao tentar criar a tag.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Criar nova Tag</DialogTitle>
          <DialogDescription>
            Adicione uma nova categoria com cor personalizada para organizar os pedidos.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="mt-4 flex flex-col gap-6"
        >
          <div className="space-y-4">
            {/* Input de Nome da Tag */}
            <div className="space-y-1.5">
              <Label htmlFor="tag-type">Nome da Tag</Label>
              <Input
                id="tag-type"
                placeholder="Ex: Peças, Brinquedos, Material..."
                {...form.register("type", { required: true })}
                autoFocus
              />
            </div>

            {/* Input de Cor */}
            <div className="space-y-1.5">
              <Label htmlFor="tag-color">Cor da Tag</Label>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-16 overflow-hidden rounded-md border border-border">
                  <input
                    id="tag-color"
                    type="color"
                    className="absolute -left-2 -top-2 h-16 w-24 cursor-pointer border-0 p-0"
                    {...form.register("color")}
                  />
                </div>
                <span className="text-sm text-muted-foreground uppercase font-mono">
                  {form.watch("color")}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="border-border border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="hover:cursor-pointer"
            >
              Cancelar
            </Button>
            <Button className="hover:cursor-pointer" type="submit" disabled={isCreating || !form.watch("type")}>
              {isCreating ? "Criando..." : "Criar Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
