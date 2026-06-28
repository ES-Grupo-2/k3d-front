"use client";

import { useEffect } from "react";

// Registra o service worker do PWA após o carregamento da página.
// Roda apenas em produção para não interferir no hot-reload do desenvolvimento.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {
          // Falha no registro não deve quebrar a aplicação.
        });
    };

    // Em apps React o efeito pode rodar após o evento `load` já ter disparado;
    // nesse caso registra imediatamente, senão aguarda o `load`.
    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
