/**
 * @author lukasnascimento1
 * @author jvs-neves
 */
import type { MetadataRoute } from "next";

  /**  
  * K3D Web App Manifest — describe an application for the browser to allow
  * installation on the home screen (PWA). Colors aligned with the dark theme of the app:
  * theme_color amber (status bar) and dark background (splash screen).
  */ 
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
