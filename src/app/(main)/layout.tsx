import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/utils/auth";
import styles from "./styles.module.scss";
import "../globals.css";
import VLibrasNext from "@/components/Libras";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (user && user.isProfileComplete === false) {
    redirect("/completar-cadastro");
  }

  return (
    <div className={styles.pageLayout}>
      <Header user={user} />

      <main className={styles.mainComponent}>{children}</main>
      <Footer />
      <VLibrasNext />
    </div>
  );
}
