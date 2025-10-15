import styles from "./loading.module.scss";
import { BsHeart } from "react-icons/bs";

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.logoContainer}>
          <BsHeart className={styles.heartIcon} />
          <div className={styles.pulse}></div>
        </div>
        <h2 className={styles.loadingTitle}>Sangue Solidário</h2>
        <p className={styles.loadingText}>Carregando a plataforma...</p>
        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress}></div>
        </div>
      </div>
    </div>
  );
}
