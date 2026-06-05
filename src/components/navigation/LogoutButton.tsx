"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { useAuthStore } from "@/store/auth/index";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  /** "full" = botão com rótulo (rodapé da sidebar); "icon" = ação rápida na navbar. */
  variant?: "full" | "icon";
  className?: string;
  /** Callback extra após o logout (ex.: fechar o drawer mobile). */
  onLoggedOut?: () => void;
}

export function LogoutButton({
  variant = "full",
  className,
  onLoggedOut,
}: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    startTransition(async () => {
      // Server Action: limpa os cookies HttpOnly de sessão.
      await logoutAction();
      // Limpa o estado client (Zustand) para refletir o logout na UI.
      logout();
      onLoggedOut?.();
      router.replace("/auth/login");
      router.refresh();
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        title="Sair"
        aria-label="Sair"
        className={cn(
          "text-foreground/80 hover:bg-destructive/10 hover:text-destructive inline-flex size-10 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <LogOut className="size-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={cn(
        "border-border text-foreground/90 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <LogOut className="size-4" />
      {isPending ? "Saindo..." : "Sair"}
    </button>
  );
}
