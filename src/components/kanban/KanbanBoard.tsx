"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/ui";

import { CardEditDialog, type CardFormData } from "./CardEditDialog";

interface KanbanCard extends CardFormData {
  id: string;
  column: ColumnId;
  tag?: string;
}

const COLUMNS = [
  { id: "TODO", label: "A fazer" },
  { id: "DOING", label: "Em produção" },
  { id: "DONE", label: "Concluído" },
] as const;

type ColumnId = (typeof COLUMNS)[number]["id"];

// Dados de exemplo (mock) — substituídos pela API quando o Kanban for ligado.
const INITIAL_CARDS: KanbanCard[] = [
  {
    id: "1",
    column: "TODO",
    title: "Lote de chaveiros LOGO",
    description: "Imprimir 10 chaveiros personalizados para o cliente.",
    tag: "Chaveiro",
  },
  {
    id: "2",
    column: "TODO",
    title: "Suporte de fone",
    description: "Modelar e imprimir 5 suportes de mesa.",
    tag: "Peça Técnica",
  },
  {
    id: "3",
    column: "DOING",
    title: "Brindes evento UFCG",
    description: "25 brindes personalizados para o evento da universidade.",
    tag: "Brinde",
  },
  {
    id: "4",
    column: "DONE",
    title: "Peça reposição impressora",
    description: "Engrenagem da extrusora para manutenção.",
    tag: "Peça Técnica",
  },
];

/**
 * Quadro Kanban de demonstração (dados mock). Integra os PopUps ao fluxo:
 * clicar num card abre a edição com guarda de alterações não salvas; o ícone
 * de lixeira pede confirmação destrutiva antes de remover.
 */
export function KanbanBoard() {
  const [cards, setCards] = useState<KanbanCard[]>(INITIAL_CARDS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editingCard = cards.find((card) => card.id === editingId) ?? null;
  const deletingCard = cards.find((card) => card.id === deletingId) ?? null;

  function handleSave(data: CardFormData) {
    setCards((prev) =>
      prev.map((card) =>
        card.id === editingId ? { ...card, ...data } : card,
      ),
    );
  }

  function handleDelete() {
    setCards((prev) => prev.filter((card) => card.id !== deletingId));
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnCards = cards.filter((card) => card.column === column.id);

          return (
            <div
              key={column.id}
              className="border-border bg-muted/20 rounded-2xl border p-3"
            >
              <div className="flex items-center justify-between px-1 pb-3">
                <h3 className="text-sm font-semibold">{column.label}</h3>
                <span className="text-muted-foreground text-xs">
                  {columnCards.length}
                </span>
              </div>

              <div className="space-y-2">
                {columnCards.map((card) => (
                  <article
                    key={card.id}
                    className="group border-border bg-card hover:border-primary/50 relative rounded-xl border p-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium">{card.title}</h4>
                      <button
                        type="button"
                        aria-label={`Excluir ${card.title}`}
                        onClick={() => setDeletingId(card.id)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive relative z-10 shrink-0 rounded-md p-1 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {card.description}
                    </p>
                    {card.tag ? (
                      <span className="bg-primary/10 text-primary mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium">
                        {card.tag}
                      </span>
                    ) : null}
                    {/* Cobre o card para abrir a edição, sem aninhar interativos */}
                    <button
                      type="button"
                      aria-label={`Editar ${card.title}`}
                      onClick={() => setEditingId(card.id)}
                      className="focus-visible:ring-primary absolute inset-0 cursor-pointer rounded-xl outline-none focus-visible:ring-2"
                    />
                  </article>
                ))}

                {columnCards.length === 0 ? (
                  <p className="text-muted-foreground/60 px-1 py-6 text-center text-xs">
                    Sem cards
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edição do card selecionado (com guarda de alterações não salvas) */}
      <CardEditDialog
        open={editingCard !== null}
        onClose={() => setEditingId(null)}
        initialValues={{
          title: editingCard?.title ?? "",
          description: editingCard?.description ?? "",
        }}
        onSave={handleSave}
      />

      {/* Confirmação de remoção destrutiva */}
      <ConfirmDialog
        open={deletingCard !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
        tone="destructive"
        title="Excluir card?"
        description={
          deletingCard
            ? `Tem certeza que deseja excluir “${deletingCard.title}”? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
      />
    </>
  );
}
