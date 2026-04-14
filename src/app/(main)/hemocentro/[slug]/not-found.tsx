import { BsExclamationCircleFill } from "react-icons/bs";
import Link from "next/link";
import styles from "./styles.module.scss";

export default function NotFound() {
  return (
    <div className={styles.error}>
      <BsExclamationCircleFill className={styles.errorIcon} />
      <h2>Instituição não encontrada</h2>
      <p>A instituição solicitada não existe ou foi removida</p>
      <Link href="/solicitacoes" className={styles.backLink}>
        Voltar para solicitações
      </Link>
    </div>
  );
}
