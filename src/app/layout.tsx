import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { AuthProvider } from "@/components/auth";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "k3d-front",
  description: "K3D Frontend Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark h-full">
      <body
        className={`${poppins.className} flex min-h-full flex-col antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
