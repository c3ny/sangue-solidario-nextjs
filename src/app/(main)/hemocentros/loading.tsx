import { PageLoading } from "@/components/PageLoading";
import { BsBuilding } from "react-icons/bs";
import styles from "@/components/PageLoading/styles.module.scss";

export default function Loading() {
  return (
    <PageLoading
      title="Carregando Painel do Hemocentro"
      subtitle="Buscando informações do estoque e agendamentos..."
      icon={
        <BsBuilding className={styles.heartIcon} style={{ fontSize: "4rem" }} />
      }
    />
  );
}
