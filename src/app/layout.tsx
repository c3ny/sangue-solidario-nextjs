import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FeatureFlagsProvider } from "@/contexts/FeatureFlagsContext";
import { ClarityComponent } from "@/components/Clarity";
import { NavigationGuard } from "@/components/NavigationGuard";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClarityComponent />
        <FeatureFlagsProvider>
          <NavigationGuard />
          {children}
        </FeatureFlagsProvider>
      </body>
    </html>
  );
}
