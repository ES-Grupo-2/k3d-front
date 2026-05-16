/**
 * @file Esqueleto visual das páginas autenticadas. Renderiza a sidebar fixa
 * (logo, navegação filtrada por perfil, identificação do usuário, alternador
 * de tema, botão Sair) e o `<Outlet />` do React Router para o conteúdo da
 * rota corrente.
 * @author lukasnascimento1
 */
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeSwitcher } from "./ThemeSwitcher";

/**
 * Componente de layout das rotas protegidas. É renderizado dentro do
 * `ProtectedRoute` em `App.tsx` e injeta o conteúdo de cada página pelo
 * `<Outlet />`.
 *
 * Filtra os itens da sidebar com base no `role` do usuário corrente (RBAC),
 * de modo que perfis Operacional não veem rotas restritas ao Gerente.
 *
 * **Onde é usado:** envolve todas as rotas privadas em `App.tsx` (Kanban,
 * Calculator, Dashboards, Clients, Tags).
 */
export function Layout() {
  const { user, logout } = useAuth();
  const navItems = [
    { to: "/kanban", title: "Kanban", roles: ["MANAGER", "OPERATOR"] },
    { to: "/calculator", title: "Calculadora", roles: ["MANAGER"] },
    { to: "/dashboard/operational", title: "Dashboard Operacional", roles: ["MANAGER", "OPERATOR"] },
    { to: "/dashboard/financial", title: "Dashboard Financeiro", roles: ["MANAGER"] },
    { to: "/clients", title: "Clientes", roles: ["MANAGER", "OPERATOR"] },
    { to: "/tags", title: "Categorias", roles: ["MANAGER"] },
  ];

  return (
    <div className="h-full flex">
      <aside className="w-60 shrink-0 border-r border-border bg-surface flex flex-col">
        <Link to="/kanban" className="px-4 py-4 text-lg font-bold tracking-wide text-foreground">
          K3D
        </Link>
        <nav className="flex-1 px-2 space-y-1">
          {navItems
            .filter((i) => user && i.roles.includes(user.role))
            .map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-border hover:text-foreground"
                  }`
                }
              >
                {i.title}
              </NavLink>
            ))}
        </nav>
        <div className="p-3 border-t border-border text-xs space-y-2">
          <div>
            <div className="text-foreground font-medium">{user?.name}</div>
            <div className="text-subtle">{user?.role}</div>
          </div>
          <ThemeSwitcher />
          <button onClick={logout} className="btn-secondary w-full text-xs py-1">
            Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
