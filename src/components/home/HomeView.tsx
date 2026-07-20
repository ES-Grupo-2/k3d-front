/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { AuthUser } from "@/schemas/auth";

import { getVisibleShortcuts } from "./home-config";

interface HomeViewProps {
  user: AuthUser;
}

/**
 * Tela inicial (hub) do sistema: saudação + cards de atalho que levam às
 * demais abas. Em repouso, cada card tem um gradiente sutil da cor da marca;
 * ao passar o mouse ou tocar (hover/active), o amarelo preenche todo o card
 * e o conteúdo escurece para manter o contraste. Respeita o RBAC.
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group border-border from-primary/25 via-card to-card hover:border-primary relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-4 transition-colors sm:p-6"
            >
              {/* Camada de preenchimento: surge no hover/toque cobrindo o card */}
              <div
                aria-hidden
                className="from-primary via-primary to-primary/75 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
              />

              <div className="relative flex flex-col">
                <span className="bg-primary/15 text-primary group-hover:bg-primary-foreground/10 group-hover:text-primary-foreground group-active:bg-primary-foreground/10 group-active:text-primary-foreground flex size-12 items-center justify-center rounded-xl transition-colors">
                  <Icon className="size-6" />
                </span>
                <h3 className="group-hover:text-primary-foreground group-active:text-primary-foreground mt-4 text-lg font-semibold transition-colors">
                  {item.label}
                </h3>
                <p className="text-muted-foreground group-hover:text-primary-foreground/75 group-active:text-primary-foreground/75 mt-1 text-sm transition-colors">
                  {item.description}
                </p>
                <span className="text-primary group-hover:text-primary-foreground group-active:text-primary-foreground mt-4 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-all group-hover:opacity-100 group-active:opacity-100">
                  Acessar <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
