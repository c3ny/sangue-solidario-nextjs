import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import styles from "./styles.module.scss";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.pageLayout}>
      <Header />
      <main className={styles.mainComponent}>{children}</main>
      <Footer />
    </div>
  );
}

