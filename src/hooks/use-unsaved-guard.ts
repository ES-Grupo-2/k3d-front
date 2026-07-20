/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import { useCallback, useEffect, useState } from "react";

interface UseUnsavedGuardOptions {
  /** Indica se há alterações não salvas no formulário (dirty fields). */
  isDirty: boolean;
  /** Fecha o contexto (modal) de fato, descartando as alterações. */
  onClose: () => void;
}

/**
 * Protege contra a perda acidental de dados em formulários. Intercepta o
 * fechamento de um modal quando há alterações não salvas, exigindo confirmação,
 * e avisa o usuário ao recarregar ou fechar a aba enquanto o formulário está
 * "sujo" (dirty).
 */
export function useUnsavedGuard({ isDirty, onClose }: UseUnsavedGuardOptions) {
  const [warnOpen, setWarnOpen] = useState(false);

  // Aviso nativo do navegador ao recarregar a página ou fechar a aba.
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Para o `onOpenChange` do Dialog: intercepta tentativas de fechar.
  // Com alterações pendentes, abre o aviso em vez de fechar direto.
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) return;
      if (isDirty) {
        setWarnOpen(true);
      } else {
        onClose();
      }
    },
    [isDirty, onClose],
  );

  // Confirma o descarte: fecha o aviso e o modal.
  const discard = useCallback(() => {
    setWarnOpen(false);
    onClose();
  }, [onClose]);

  return { handleOpenChange, warnOpen, setWarnOpen, discard };
}
