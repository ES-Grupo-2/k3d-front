import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
