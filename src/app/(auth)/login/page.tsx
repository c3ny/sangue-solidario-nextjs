"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { BsHeart } from "react-icons/bs";
import styles from "./styles.module.scss";

export default function Login() {
  return (
    <main className={styles.container}>
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>

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

// Loading skeleton while Suspense is resolving
function LoginFormSkeleton() {
  return (
    <div className={styles.formSection}>
      <div className={styles.formContent}>
        <div className={styles.loadingSkeleton}>
          <div className={styles.skeletonLogo} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonInput} />
          <div className={styles.skeletonInput} />
          <div className={styles.skeletonButton} />
        </div>
      </div>
    </div>
  );
}
