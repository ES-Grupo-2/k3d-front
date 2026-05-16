/**
 * @file Bootstrap da aplicação React. Cria a raiz do ReactDOM e envolve o
 * `<App />` em todos os providers globais (na ordem: tema, react-query,
 * router, auth). Também monta o `<ThemedToaster />` para notificações.
 * @author lukasnascimento1
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemedToaster } from "./components/ThemedToaster";
import { App } from "./App";
import "./index.css";

/**
 * Cliente de cache do React Query. Configurado com:
 * - `retry: 1` — uma única retentativa em caso de erro de rede.
 * - `refetchOnWindowFocus: false` — evita refetch ao trocar de aba (poderia
 *   gerar tráfego desnecessário em uma SPA pequena como esta).
 */
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

// Hierarquia dos providers (externo → interno):
// ThemeProvider → QueryClientProvider → BrowserRouter → AuthProvider.
// O ThemeProvider precisa ser o mais externo para que o ThemedToaster
// (irmão de App) também enxergue o tema.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
            <ThemedToaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
