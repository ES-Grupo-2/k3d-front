"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Falha ao carregar pedidos:", error);
  }, [error]);

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-8" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Falha ao carregar o histórico
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Não foi possível conectar com o servidor. Verifique sua conexão ou tente novamente.
        </p>
      </div>
      <Button
        onClick={() => reset()}
        variant="outline"
        className="mt-4 gap-2"
      >
        <RefreshCcw className="size-4 hover:cursor-pointer" />
        Tentar Novamente
      </Button>
    </div>
  );
}