import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeatureFlagsProvider } from "@/contexts/FeatureFlagsContext";
import styles from "./styles.module.scss";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${styles.pageLayout}`}
      >
        <FeatureFlagsProvider>
          <Header />
          <main className={styles.mainComponent}>{children}</main>
          <Footer />
        </FeatureFlagsProvider>
      </body>
    </html>
  );
}
