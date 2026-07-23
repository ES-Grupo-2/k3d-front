/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Router Cache (client-side): reusa segmentos de páginas dinâmicas por 60s ao
  // navegar por links (navegação instantânea, sem ir ao servidor). Um F5/reload
  // ignora esse cache e re-renderiza no servidor — então recarregar sempre traz
  // dados frescos do backend (ex.: dashboards). Padrão do `dynamic` é 0 (sem cache).
  experimental: {
    staleTimes: {
      dynamic: 60,
    },
  },
  async headers() {
    return [
      {
        // Ensures correct Content-Type and prevents caching of the service worker,
        // so that new versions are always downloaded.
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

// Expõe os bindings do Cloudflare durante `next dev` (necessário pelo adaptador OpenNext).
initOpenNextCloudflareForDev();
