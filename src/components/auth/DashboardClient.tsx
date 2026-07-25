"use client";

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import type { AuthUser } from "@/schemas/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { ROLE_LABELS } from "@/components/navigation/nav-config";

interface DashboardClientProps {
  user: AuthUser;
}

export function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Olá, {user.name || user.email}
        </h2>
        <p className="text-muted-foreground text-sm">
          Bem-vindo de volta à plataforma K3D.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sessão ativa</CardTitle>
            <CardDescription>Você está autenticado.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Perfil de acesso:{" "}
            <span className="text-foreground font-medium">
              {ROLE_LABELS[user.role]}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operação</CardTitle>
            <CardDescription>Kanban e pedidos</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Use o menu lateral para acompanhar o fluxo de produção.
          </CardContent>
        </Card>

        {user.role === "GERENTE" && (
          <Card>
            <CardHeader>
              <CardTitle>Gestão</CardTitle>
              <CardDescription>Acesso exclusivo do gerente</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Registre novos usuários e acompanhe os relatórios.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
