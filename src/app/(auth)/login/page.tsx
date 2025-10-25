import LoginForm from "./LoginForm";
import { BsHeart } from "react-icons/bs";
import styles from "./styles.module.scss";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const redirect = (await searchParams).redirect ?? "/";
  return (
    <main className={styles.container}>
      <LoginForm redirect={redirect} />

      <div className={styles.visualSection}>
        <div className={styles.visualContent}>
          <div className={styles.badge}>
            <BsHeart className={styles.badgeIcon} />
            <span>Faça a diferença</span>
          </div>
          <h2 className={styles.visualTitle}>
            Cada gota conta.
            <br />
            <span className={styles.highlight}>Cada doação salva vidas.</span>
          </h2>
          <p className={styles.visualText}>
            Junte-se a milhares de doadores que estão fazendo a diferença em
            todo o Brasil. Sua solidariedade transforma vidas.
          </p>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1000+</span>
              <span className={styles.statLabel}>Vidas salvas</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Doadores ativos</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
