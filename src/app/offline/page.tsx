import { WifiOff } from "lucide-react";

// Página de fallback do PWA exibida quando o app é aberto sem conexão.
// É pré-cacheada pelo service worker, então funciona mesmo offline.
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="bg-primary/15 text-primary flex size-16 items-center justify-center rounded-2xl">
        <WifiOff className="size-8" />
      </span>
      <div>
        <h1 className="text-foreground text-xl font-semibold">
          Você está offline
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Verifique sua conexão e tente novamente.
        </p>
      </div>
    </main>
  );
}
