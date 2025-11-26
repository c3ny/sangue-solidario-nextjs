import styles from "./styles.module.scss";

export default function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Carregando informações...</p>
    </div>
  );
}
