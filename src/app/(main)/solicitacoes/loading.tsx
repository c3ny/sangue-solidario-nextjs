import { PageLoading } from "@/components/PageLoading";
import { BsDroplet } from "react-icons/bs";
import styles from "@/components/PageLoading/styles.module.scss";

export default function Loading() {
  return (
    <PageLoading
      title="Carregando solicitações"
      subtitle="Buscando pessoas que precisam de doação..."
      icon={
        <BsDroplet className={styles.heartIcon} style={{ fontSize: "4rem" }} />
      }
    />
  );
}
