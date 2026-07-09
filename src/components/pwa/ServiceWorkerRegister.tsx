"use client";

import { useEffect } from "react";

/**
 *  Registers the service worker for the PWA after the page has loaded.
 *  Runs only in production to avoid interfering with hot-reload during development.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {
        });
    };

    /**
     * In React apps, the effect may run after the `load` event has already fired;
     * in that case, register immediately; otherwise, wait for the `load` event.
     */
    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
