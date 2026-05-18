/**
 * @file Página pública de login. Único ponto de entrada não autenticado.
 * Layout split (brand pane + form pane) no estilo EyePleasure.
 * @author lukasnascimento1
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import toast from "react-hot-toast";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("gerente@k3d.local");
  const [password, setPassword] = useState("gerente123");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/kanban");
    } catch (err: any) {
      toast.error(err.response?.data?.mensagem ?? "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      <div className="fixed top-5 right-5 z-10">
        <ThemeSwitcher />
      </div>

      <div
        className="grid md:grid-cols-2 grid-cols-1 w-full max-w-5xl min-h-[560px] rounded-[28px] overflow-hidden ep-glass"
        style={{ boxShadow: "var(--ep-shadow-elevated)" }}
      >
        {/* Brand pane */}
        <aside
          className="relative hidden md:flex flex-col justify-between p-12 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,.12), rgba(139,92,246,.04))",
            borderRight: "1px solid var(--ep-border)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 0% 0%, rgba(99,102,241,.25), transparent 50%), radial-gradient(circle at 100% 100%, rgba(139,92,246,.22), transparent 50%)",
            }}
          />

          <div className="relative z-10 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
              style={{
                background: "linear-gradient(135deg, var(--ep-primary), var(--ep-accent))",
              }}
            >
              K3D
            </div>
            <div>
              <div className="font-black text-base tracking-tight text-foreground">K3D</div>
              <div className="text-[9px] text-faint uppercase tracking-[2px]">
                Tasker Kria3D Control
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center my-6">
            <Logo3D />
          </div>

          <div className="relative z-10">
            <h2 className="text-[30px] font-extrabold tracking-tight leading-[1.18] mb-3 text-foreground">
              Gerencie pedidos de impressão <em className="not-italic gradient-text">3D</em>.
            </h2>
            <p className="text-[14px] text-muted leading-relaxed max-w-sm">
              Kanban, calculadora de custo e dashboards financeiros — tudo num
              só painel.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-3.5 mt-8">
            <FeatureRow icon={<IconKanban />} label="Kanban com drag-and-drop" />
            <FeatureRow icon={<IconCalculator />} label="Calculadora inteligente de custo" />
            <FeatureRow icon={<IconChart />} label="Dashboards operacional e financeiro" />
          </div>
        </aside>

        {/* Form pane */}
        <section
          className="p-12 flex flex-col justify-center"
          style={{ background: "var(--ep-surface-strong)" }}
        >
          <h1 className="text-[26px] font-extrabold tracking-tight mb-1.5 text-foreground">
            Entrar na sua conta
          </h1>
          <p className="text-[13px] text-muted mb-6">
            Use suas credenciais de Gerente ou Operacional.
          </p>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="f-email">E-mail</label>
              <input
                id="f-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="f-password">Senha</label>
              <input
                id="f-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="current-password"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
              style={{ height: 46 }}
            >
              {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-[12px] text-faint text-center">
            Demo: <code className="text-muted">gerente@k3d.local</code> /{" "}
            <code className="text-muted">gerente123</code>
          </p>
        </section>
      </div>

      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, var(--ep-primary-soft), var(--ep-accent-soft));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
}

function FeatureRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-fg-soft">
      <span
        className="w-[30px] h-[30px] rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(99,102,241,.14)", color: "var(--ep-primary-soft)" }}
      >
        {icon}
      </span>
      {label}
    </div>
  );
}

function Logo3D() {
  return (
    <div
      className="w-[300px] h-[300px] flex items-center justify-center"
      style={{ filter: "drop-shadow(0 22px 60px rgba(139, 92, 246, 0.4))" }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="cube-grad-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="cube-grad-left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6366f1" />
            <stop offset="1" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="cube-grad-right" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#4c1d95" />
          </linearGradient>
        </defs>
        <polygon points="100,30 170,70 100,110 30,70" fill="url(#cube-grad-top)" />
        <polygon points="30,70 30,140 100,180 100,110" fill="url(#cube-grad-left)" />
        <polygon points="170,70 170,140 100,180 100,110" fill="url(#cube-grad-right)" />
        <polyline points="100,30 100,110 30,70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <polyline points="100,110 170,70" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <polyline points="100,110 100,180" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      </svg>
    </div>
  );
}

function IconKanban() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="6" height="14" rx="1" />
      <rect x="11" y="3" width="6" height="9" rx="1" />
      <rect x="19" y="3" width="2" height="6" rx="1" />
    </svg>
  );
}

function IconCalculator() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="19" x2="16" y2="19" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="20" x2="4" y2="10" />
      <line x1="10" y1="20" x2="10" y2="4" />
      <line x1="16" y1="20" x2="16" y2="14" />
      <line x1="22" y1="20" x2="2" y2="20" />
    </svg>
  );
}
