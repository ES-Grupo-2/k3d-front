import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { AuthUser } from "@/schemas/auth";

import { getVisibleShortcuts } from "./home-config";

interface HomeViewProps {
  user: AuthUser;
}

/**
 * Tela inicial (hub) do sistema: saudação + cards de atalho que levam às
 * demais abas. Os atalhos respeitam o perfil de acesso do usuário (RBAC).
 */
export function HomeView({ user }: HomeViewProps) {
  const shortcuts = getVisibleShortcuts(user.role);
  const firstName = (user.name || user.email).split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Olá, {firstName}</h2>
        <p className="text-muted-foreground text-sm">
          O que você quer fazer? Acesse rapidamente os módulos do sistema.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group border-border bg-card hover:border-primary/50 flex flex-col rounded-2xl border p-6 transition-colors"
            >
              <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.label}</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {item.description}
              </p>
              <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                Acessar <ArrowRight className="size-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
