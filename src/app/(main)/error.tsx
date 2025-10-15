"use client";

import { useEffect } from "react";
import { BsExclamationTriangle, BsArrowLeft } from "react-icons/bs";
import styles from "./error.module.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Home page error:", error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <BsExclamationTriangle className={styles.errorIcon} />
        <h2 className={styles.errorTitle}>Algo deu errado</h2>
        <p className={styles.errorMessage}>
          Não foi possível carregar a página inicial. Por favor, tente
          novamente.
        </p>
        <div className={styles.errorActions}>
          <button onClick={reset} className={styles.retryButton}>
            Tentar novamente
          </button>
          <a href="/" className={styles.homeButton}>
            <BsArrowLeft className={styles.buttonIcon} />
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}
