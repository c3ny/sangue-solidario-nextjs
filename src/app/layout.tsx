import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { FeatureFlagsProvider } from "@/contexts/FeatureFlagsContext";
import { ClarityComponent } from "@/components/Clarity";
import { EmotionCacheProvider } from "@/components/EmotionCacheProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sangue Solidário",
  description: "Mudando a vida através da solidariedade",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClarityComponent />
        <EmotionCacheProvider nonce={nonce}>
          <FeatureFlagsProvider>
            {children}
          </FeatureFlagsProvider>
        </EmotionCacheProvider>
      </body>
    </html>
  );
}
