import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AcouNorm - Análise de Isolamento Acústico",
  description:
    "Sistema profissional para avaliação de isolamento acústico em edificações conforme normas técnicas brasileiras.",
  generator: "AcouNorm",
  keywords: [
    "acústica",
    "isolamento acústico",
    "edificações",
    "NBR",
    "engenharia",
    "medição",
  ],
  authors: [{ name: "AcouNorm" }],
};

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="font-sans antialiased min-h-screen bg-background">
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
