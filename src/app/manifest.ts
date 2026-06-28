import type { MetadataRoute } from "next";

// Web App Manifest do K3D — descreve a aplicação para o navegador permitir a
// instalação na tela inicial (PWA). Cores alinhadas ao tema escuro do app:
// theme_color âmbar (barra do SO) e background escuro (splash de abertura).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kria 3D",
    short_name: "Kria 3D",
    description: "Gestão de pedidos e produção da Kria 3D.",
    start_url: "/inicio",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a1c1c",
    theme_color: "#ffc94d",
    lang: "pt-BR",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
