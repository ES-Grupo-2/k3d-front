'use client'

/**
 * @author lukasnascimento1
 * @author jvs-neves
 */

import { WifiOff, RefreshCcw } from "lucide-react";

/** Fallback page for offline mode. 
 * This page is pre-cached by the service worker and will be displayed when the user is offline.
 * Furthermore, this page has a refresh button to allow the user to retry loading the page when they regain connectivity.
 */
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <WifiOff className="size-8" />
      </span>
      
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Você está offline
        </h1>
        <p className="mt-1 max-w-62.5 text-sm text-muted-foreground">
          Verifique sua conexão com a internet e tente carregar a página novamente.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="mt-2 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium 
        text-primary-foreground 
        shadow-sm transition-colors hover:bg-primary/90 active:scale-95"
      >
        <RefreshCcw className="size-4" />
        Tentar Novamente
      </button>
    </main>
  );
}