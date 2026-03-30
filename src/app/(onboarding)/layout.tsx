import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Sangue Solidário - Completar cadastro",
  description: "Complete seu cadastro para acessar todas as funcionalidades",
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
