// Podem ser movidas para dentro de feature/kanban/..

// O identificador pode ser outro (como UUID), a depender de como lidemos com a modelagem
export type UniqueIdentifier = string | number;

export interface KanbanColumn {
  id: UniqueIdentifier;
  title: string;
}

// Pode ser substituída por Card. Verificar Modelagem para outras características
export interface KanbanTask {
  id: UniqueIdentifier;
  columnId: UniqueIdentifier;
  title: string;
  description?: string;
  clientName: string;
  value: number;
  date: string; // formato ISO 8601 (YYYY-MM-DD) ou outro  
  tags?: string[];
}