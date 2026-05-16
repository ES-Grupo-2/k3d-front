/**
 * @file Cliente HTTP central baseado em Axios. Define a instância única `api`
 * usada por todas as páginas e contextos do frontend para falar com o backend Fastify.
 * Inclui interceptors para anexar o JWT em toda requisição e tratar 401 global.
 * @author lukasnascimento1
 */
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3333";

/**
 * Instância Axios pré-configurada com a URL base do backend.
 *
 * **Onde é usada:** importada por todas as páginas (`Kanban`, `Clients`, `Tags`,
 * `Calculator`, `OperationalDashboard`, `FinancialDashboard`) e pelos contextos
 * (`AuthContext`) para realizar as chamadas REST autenticadas.
 */
export const api = axios.create({ baseURL });

// Interceptor de requisição: injeta o token JWT (se houver) no header Authorization.
// Roda automaticamente antes de toda chamada feita via `api.get/post/put/delete`.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("k3d:token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de resposta: se o backend responder 401 (token inválido/expirado),
// limpa os dados locais do usuário e força o redirect para /login.
// Garante que sessões expiradas não fiquem em estado inconsistente.
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("k3d:token");
      localStorage.removeItem("k3d:user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);
