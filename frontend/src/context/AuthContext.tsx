/**
 * @file Contexto global de autenticação. Mantém o usuário corrente em memória
 * e em `localStorage`, expõe `login`/`logout` para as páginas e bloqueia a
 * renderização das rotas privadas enquanto o estado é hidratado.
 * @author lukasnascimento1
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../api/client";
import type { User } from "../api/types";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

/**
 * Provider que disponibiliza o contexto de autenticação para a árvore React.
 * Hidrata o usuário a partir do `localStorage` no primeiro render e expõe as
 * funções `login` e `logout` para os consumidores.
 *
 * **Onde é usado:** envolve toda a aplicação em `main.tsx`, dentro do
 * `ThemeProvider` e do `QueryClientProvider`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hidrata o usuário a partir do localStorage no primeiro render.
  // Evita que rotas protegidas redirecionem para /login no F5 enquanto a
  // sessão ainda está sendo lida do storage.
  useEffect(() => {
    const stored = localStorage.getItem("k3d:user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  /**
   * Realiza a autenticação contra `POST /auth/login`, persiste o token e os
   * dados do usuário no `localStorage` e atualiza o estado do contexto.
   *
   * **Onde é usada:** `LoginPage.tsx` ao submeter o formulário.
   *
   * @param email - email cadastrado do usuário
   * @param password - senha em texto plano (o backend faz o bcrypt compare)
   * @throws repassa o erro do Axios se as credenciais forem inválidas (401)
   */
  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("k3d:token", data.token);
    localStorage.setItem("k3d:user", JSON.stringify(data.user));
    setUser(data.user);
  }

  /**
   * Encerra a sessão: remove token e dados do usuário do `localStorage`,
   * limpa o estado e redireciona para `/login`.
   *
   * **Onde é usada:** botão "Sair" no `Layout.tsx` (sidebar).
   */
  function logout() {
    localStorage.removeItem("k3d:token");
    localStorage.removeItem("k3d:user");
    setUser(null);
    window.location.href = "/login";
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

/**
 * Hook de conveniência para consumir o `AuthContext`. Lança um erro se for
 * usado fora do `AuthProvider` (catch precoce de bugs de wiring).
 *
 * **Onde é usado:** `LoginPage`, `Layout`, `ProtectedRoute`, `Kanban`,
 * `Clients` e qualquer componente que precise do usuário ou de `logout`.
 *
 * @returns objeto com `user`, `loading`, `login`, `logout`
 */
export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth fora do AuthProvider");
  return ctx;
}
