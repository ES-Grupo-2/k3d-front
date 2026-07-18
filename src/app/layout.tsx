import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";

import { AuthProvider } from "@/components/auth";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { ThemeProvider } from "@/components/theme";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  applicationName: "Kria 3D",
  title: {
    default: "Kria 3D",
    template: "%s · Kria 3D",
  },
  description: "Gestão de pedidos e produção da Kria 3D.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "Kria 3D",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8ecca" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1c1c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full" suppressHydrationWarning>
      <body
        className={`${poppins.className} flex min-h-full flex-col antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
