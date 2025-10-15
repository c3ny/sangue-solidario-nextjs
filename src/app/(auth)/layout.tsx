import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sangue Solidário - Autenticação",
  description: "Login e cadastro - Sangue Solidário",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
