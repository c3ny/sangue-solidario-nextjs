import styles from "./loading.module.scss";
import { BsDroplet } from "react-icons/bs";

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.dropletContainer}>
          <BsDroplet className={styles.dropletIcon} />
          <div className={styles.ripple}></div>
        </div>
        <h2 className={styles.loadingTitle}>Carregando solicitações</h2>
        <p className={styles.loadingText}>
          Buscando pessoas que precisam de doação...
        </p>
        <div className={styles.dots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
      </div>
    </div>
  );
}

