/**
 * @file Esqueleto visual das rotas autenticadas — sidebar com logo K3D,
 * navegação filtrada por perfil, perfil do usuário, alternador de tema
 * e botão Sair. Estilo EyePleasure (sidebar translúcida sobre o bg-scan).
 * @author lukasnascimento1
 */
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeSwitcher } from "./ThemeSwitcher";

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
      <aside
        className="w-64 shrink-0 flex flex-col"
        style={{
          background: "var(--ep-surface)",
          borderRight: "1px solid var(--ep-border)",
          backdropFilter: "blur(20px) saturate(1.3)",
          WebkitBackdropFilter: "blur(20px) saturate(1.3)",
        }}
      >
        <Link to="/kanban" className="px-5 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm tracking-tight"
            style={{ background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }}>
            K3D
          </div>
          <div>
            <div className="text-foreground font-extrabold tracking-tight">K3D</div>
            <div className="text-[9px] text-faint uppercase tracking-[2px]">
              Tasker Kria3D
            </div>
          </div>
        </Link>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems
            .filter((i) => user && i.roles.includes(user.role))
            .map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                className={({ isActive }) =>
                  `block rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
                    isActive
                      ? "text-white shadow-card"
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }
                    : {}
                }
              >
                {i.title}
              </NavLink>
            ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }}>
              {user?.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-foreground font-semibold text-xs truncate">{user?.name}</div>
              <div className="text-faint text-[10px] uppercase tracking-wider">{user?.role}</div>
            </div>
          </div>
          <ThemeSwitcher />
          <button onClick={logout} className="btn-glass w-full text-xs" style={{ height: 36 }}>
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
