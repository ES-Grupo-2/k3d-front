"use client";

import { useRouter } from "next/navigation";

import { logoutAction } from "@/actions/auth";
import type { AuthUser } from "@/schemas/auth";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useAuthStore } from "@/store/auth/index";

interface DashboardClientProps {
  user: AuthUser;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  async function handleLogout() {
    await logoutAction();
    logout();
    router.push("/auth/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Area autenticada</CardTitle>
          <CardDescription>
            Sessao ativa para {user.name || user.email}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm">
            Perfil: {user.role}
          </span>
          <Button onClick={handleLogout}>Sair</Button>
          <Button
            disabled={user.role !== "GERENTE"}
            variant="outline"
            onClick={() => router.push("/auth/register")}
          >
            Cadastro
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
