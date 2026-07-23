"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { useAuthStore } from "@/store/auth/index";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface LogoutButtonProps {
  variant?: "full" | "icon";
  className?: string;
  onLoggedOut?: () => void;
}

export function LogoutButton({
  variant = "full",
  className,
  onLoggedOut,
}: LogoutButtonProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Executa o logout de fato — só é chamado após a confirmação no popover.
  // Limpa os cookies HttpOnly e o estado do cliente, então redireciona ao login.
  async function performLogout() {
    setPending(true);
    try {
      await logoutAction();
      logout();
      onLoggedOut?.();
      router.replace("/auth/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  // Fecha o popover ao clicar fora ou pressionar Esc.
  useEffect(() => {
    if (!confirmOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setConfirmOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setConfirmOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [confirmOpen]);

  const trigger =
    variant === "icon" ? (
      <button
        type="button"
        onClick={() => setConfirmOpen((prev) => !prev)}
        title="Sair"
        aria-label="Sair"
        className={cn(
          "text-foreground/80 hover:bg-destructive/10 hover:text-destructive inline-flex size-10 items-center justify-center rounded-lg transition-colors",
          className,
        )}
      >
        <LogOut className="size-5" />
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setConfirmOpen((prev) => !prev)}
        className={cn(
          "border-border text-foreground/90 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
          className,
        )}
      >
        <LogOut className="size-4" />
        Sair
      </button>
    );

  return (
    <div ref={containerRef} className="relative">
      {trigger}

      {confirmOpen && (
        <div
          role="dialog"
          className={cn(
            "border-border bg-card absolute bottom-full left-0 z-50 mb-2 w-56 rounded-lg border p-3 shadow-lg",
            "animate-in fade-in slide-in-from-bottom-1",
          )}
        >
          <p className="text-foreground text-sm font-medium">Sair da conta?</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Você precisará entrar novamente para acessar o sistema.
          </p>

          <div className="mt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => setConfirmOpen(false)}
              className="rounded-md px-3 py-1.5 text-xs hover:cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={performLogout}
              className="rounded-md px-3 py-1.5 text-xs hover:cursor-pointer"
            >
              {pending ? "Saindo..." : "Sair"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
