import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentUser } from "@/utils/auth";
import styles from "./styles.module.scss";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div className={styles.pageLayout}>
      <Header user={user} />
      <main className={styles.mainComponent}>{children}</main>
      <Footer />
    </div>
  );
}
