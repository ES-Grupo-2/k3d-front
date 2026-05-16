/**
 * @file Página pública de login. É o único ponto de entrada não autenticado
 * da aplicação — todas as outras rotas exigem sessão ativa via `ProtectedRoute`.
 * @author lukasnascimento1
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

/**
 * Página de autenticação. Apresenta um formulário simples (email + senha)
 * pré-preenchido com as credenciais do usuário demo e dispara o `login` do
 * `AuthContext`. Em caso de sucesso, redireciona para `/kanban`; em caso de
 * erro, mostra um toast com a mensagem retornada pelo backend.
 *
 * **Onde é usada:** rota `/login` em `App.tsx` (única rota pública).
 */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("gerente@k3d.local");
  const [password, setPassword] = useState("gerente123");
  const [loading, setLoading] = useState(false);

  /**
   * Handler do submit do formulário. Mantém `loading` durante a chamada para
   * desabilitar o botão e evitar duplo submit. Em sucesso, navega para a
   * rota inicial autenticada; em falha, exibe toast com a mensagem do erro.
   */
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
    <div className="h-full flex items-center justify-center bg-background">
      <form
        onSubmit={submit}
        className="panel p-8 w-full max-w-sm space-y-4 shadow-lg"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">K3D</h1>
          <p className="text-sm text-muted">Tasker Kria3D Control</p>
        </div>

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
            minLength={6}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-xs text-subtle text-center">
          Demo: <code>gerente@k3d.local</code> / <code>gerente123</code>
        </p>
      </form>
    </div>
  );
}
