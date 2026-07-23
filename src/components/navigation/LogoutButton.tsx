"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { useAuthStore } from "@/store/auth/index";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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

  // Executa o logout de fato — só é chamado após a confirmação no pop-up.
  // Limpa os cookies HttpOnly e o estado do cliente, então redireciona ao login.
  async function performLogout() {
    await logoutAction();
    logout();
    onLoggedOut?.();
    router.replace("/auth/login");
    router.refresh();
  }

  const trigger =
    variant === "icon" ? (
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
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
        onClick={() => setConfirmOpen(true)}
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
    <>
      {trigger}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        tone="destructive"
        title="Sair da conta?"
        description="Você precisará entrar novamente para acessar o sistema."
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        onConfirm={performLogout}
      />
    </>
  );
}
