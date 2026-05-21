/**
 * @file Esqueleto visual das rotas autenticadas — sidebar com logo K3D,
 * navegação filtrada por perfil, perfil do usuário, alternador de tema
 * e botão Sair. Estilo EyePleasure (sidebar translúcida sobre o bg-scan).
 * @author lukasnascimento1
 */
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { KanbanSquare, Calculator, BarChart2, TrendingUp, Users, Tag, Menu, X, LogOut, type LucideIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { to: string; title: string; roles: string[]; icon: LucideIcon }[] = [
    { to: "/kanban", title: "Kanban", roles: ["MANAGER", "OPERATOR"], icon: KanbanSquare },
    { to: "/calculator", title: "Calculadora", roles: ["MANAGER"], icon: Calculator },
    { to: "/dashboard/operational", title: "Dashboard Operacional", roles: ["MANAGER", "OPERATOR"], icon: BarChart2 },
    { to: "/dashboard/financial", title: "Dashboard Financeiro", roles: ["MANAGER"], icon: TrendingUp },
    { to: "/clients", title: "Clientes", roles: ["MANAGER", "OPERATOR"], icon: Users },
    { to: "/tags", title: "Categorias", roles: ["MANAGER"], icon: Tag },
  ];

  const filtered = navItems.filter((i) => user && i.roles.includes(user.role));

  const sidebarStyle = {
    background: "var(--ep-surface)",
    borderRight: "1px solid var(--ep-border)",
    backdropFilter: "blur(20px) saturate(1.3)",
    WebkitBackdropFilter: "blur(20px) saturate(1.3)",
  };

  function NavItems({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
    return (
      <>
        {filtered.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            onClick={onNavigate}
            title={collapsed ? i.title : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-xl transition-all font-medium text-[13px] ${
                collapsed ? "justify-center px-0 py-2.5 w-10 mx-auto" : "gap-3 px-3.5 py-2.5"
              } ${
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
            <i.icon size={16} strokeWidth={1.8} className="shrink-0" />
            {!collapsed && i.title}
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <div className="h-full flex">
      {/* Mobile: top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center px-4 h-14"
        style={{ background: "var(--ep-surface)", borderBottom: "1px solid var(--ep-border)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <button onClick={() => setMobileOpen(true)} className="text-muted hover:text-foreground p-1">
          <Menu size={20} />
        </button>
        <Link to="/kanban" className="flex items-center gap-2 mx-auto">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs"
            style={{ background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }}
          >
            K3D
          </div>
          <span className="text-foreground font-extrabold tracking-tight text-sm">K3D</span>
        </Link>
        <div className="w-8" />
      </div>

      {/* Mobile: drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 flex flex-col h-full z-50" style={sidebarStyle}>
            <div className="px-5 py-5 flex items-center justify-between">
              <Link to="/kanban" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
                  style={{ background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }}
                >
                  K3D
                </div>
                <div>
                  <div className="text-foreground font-extrabold tracking-tight">K3D</div>
                  <div className="text-[9px] text-faint uppercase tracking-[2px]">Tasker Kria3D</div>
                </div>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="text-muted hover:text-foreground p-1">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              <NavItems collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </nav>
            <div className="p-4 border-t border-border space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }}
                >
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
        </div>
      )}

      {/* Tablet: icon-only sidebar */}
      <aside
        className="hidden md:flex lg:hidden w-16 shrink-0 flex-col items-center py-4 gap-2"
        style={sidebarStyle}
      >
        <Link to="/kanban" className="mb-2" title="K3D">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs"
            style={{ background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }}
          >
            K3D
          </div>
        </Link>
        <nav className="flex-1 flex flex-col items-center space-y-1 w-full">
          <NavItems collapsed={true} />
        </nav>
        <div className="flex flex-col items-center gap-2 border-t border-border pt-3 w-full">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }}
            title={user?.name}
          >
            {user?.name.charAt(0)}
          </div>
          <button
            onClick={logout}
            title="Sair"
            className="text-muted hover:text-foreground p-2 rounded-xl hover:bg-surface-hover transition-all"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Desktop: full sidebar */}
      <aside
        className="hidden lg:flex w-64 shrink-0 flex-col"
        style={sidebarStyle}
      >
        <Link to="/kanban" className="px-5 py-5 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm tracking-tight"
            style={{ background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }}
          >
            K3D
          </div>
          <div>
            <div className="text-foreground font-extrabold tracking-tight">K3D</div>
            <div className="text-[9px] text-faint uppercase tracking-[2px]">Tasker Kria3D</div>
          </div>
        </Link>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <NavItems collapsed={false} />
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))" }}
            >
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

      {/* Main content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  );
}
