"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function KanbanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro ao carregar pedidos do Kanban:", error);
  }, [error]);

  /**
   * Render's the error page with a message and a button to reset the error boundary.
   * Futhermore, the retry button will call the reset function to re-render the component 
   * and try to fetch the data again.
   */
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-160px)] gap-4 text-center">
      <h2 className="text-xl font-semibold text-foreground">
        Ops, algo deu errado!
      </h2>
      <p className="text-subtle">
        Não foi possível carregar o quadro de pedidos.
      </p>
      <Button onClick={() => reset()} variant="outline" className="cursor-pointer">
        Tentar Novamente
      </Button>
    </div>
  );
}