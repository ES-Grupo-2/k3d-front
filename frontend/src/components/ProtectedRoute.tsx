/**
 * @file Guard de rotas privadas. Aplica duas camadas de proteção:
 * autenticação (precisa estar logado) e autorização opcional por perfil
 * (RBAC via prop `roles`).
 * @author lukasnascimento1
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../api/types";

type Props = {
  children: React.ReactNode;
  roles?: Role[];
};

/**
 * Wrapper de rotas protegidas. Lógica de decisão:
 *
 * 1. Se o `AuthContext` ainda está hidratando o usuário (`loading`),
 *    renderiza `null` para evitar redirect prematuro durante o F5.
 * 2. Se não há usuário autenticado, redireciona para `/login`.
 * 3. Se `roles` foi fornecido e o perfil do usuário não está incluso,
 *    redireciona para `/kanban` (rota acessível por todos os perfis).
 * 4. Caso contrário, renderiza o `children`.
 *
 * **Onde é usado:** `App.tsx`. Aparece duas vezes — na raiz das rotas
 * privadas (sem `roles`, exigindo apenas login) e ao redor de
 * `CalculatorPage`, `FinancialDashboardPage` e `TagsPage` (exigindo `MANAGER`).
 *
 * @param children - conteúdo a renderizar se a verificação passar
 * @param roles - lista opcional de perfis autorizados; se omitida, qualquer
 *                usuário autenticado tem acesso
 */
export function ProtectedRoute({ children, roles }: Props) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/kanban" replace />;
  return <>{children}</>;
}
