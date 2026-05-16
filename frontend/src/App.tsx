/**
 * @file Configuração de rotas da aplicação. Define a única rota pública
 * (`/login`) e as rotas privadas (todas envolvidas em `ProtectedRoute` +
 * `Layout`), aplicando RBAC adicional nas rotas restritas ao MANAGER.
 * @author lukasnascimento1
 */
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/Login";
import { KanbanPage } from "./pages/Kanban";
import { CalculatorPage } from "./pages/Calculator";
import { OperationalDashboardPage } from "./pages/OperationalDashboard";
import { FinancialDashboardPage } from "./pages/FinancialDashboard";
import { ClientsPage } from "./pages/Clients";
import { TagsPage } from "./pages/Tags";

/**
 * Componente raiz que define todas as rotas da aplicação. Estrutura:
 *
 * - `/login` — pública.
 * - Demais rotas — encapsuladas por `ProtectedRoute` (exige usuário logado)
 *   e renderizadas dentro do `Layout` (sidebar + outlet).
 * - Rotas adicionais usam um segundo `ProtectedRoute roles={["MANAGER"]}`
 *   para restringir Calculadora, Dashboard Financeiro e Categorias.
 * - `*` (catch-all) redireciona para `/kanban`.
 *
 * **Onde é usado:** renderizado em `main.tsx`, dentro do `BrowserRouter`.
 */
export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/kanban" replace />} />
        <Route path="/kanban" element={<KanbanPage />} />
        <Route
          path="/calculator"
          element={
            <ProtectedRoute roles={["MANAGER"]}>
              <CalculatorPage />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/operational" element={<OperationalDashboardPage />} />
        <Route
          path="/dashboard/financial"
          element={
            <ProtectedRoute roles={["MANAGER"]}>
              <FinancialDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/clients" element={<ClientsPage />} />
        <Route
          path="/tags"
          element={
            <ProtectedRoute roles={["MANAGER"]}>
              <TagsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/kanban" replace />} />
    </Routes>
  );
}
