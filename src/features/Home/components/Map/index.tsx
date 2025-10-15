"use client";
import styles from "./styles.module.scss";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
import { BsArrowRight, BsGeoAlt, BsHeart } from "react-icons/bs";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <Loading width="100%" height="600px" />,
});

export interface IMapSectionProps {
  solicitations: Solicitation[];
}

export const MapSection = ({ solicitations }: IMapSectionProps) => {
  const router = useRouter();

  const markers = solicitations?.map((solicitation) => ({
    location: solicitation.location,
    tooltip: solicitation.name,
    onClick: () => {
      router.push(`/visualizar-solicitacao/${solicitation.id}`);
    },
  }));

  const quantity = useMemo(() => {
    const quantityOfHandlers = solicitations.reduce(
      (prev, next) => (next.user?.type === "handler" ? prev + 1 : prev),
      0
    );

    const quantityOfUsers = solicitations.reduce(
      (prev, next) => (next.user?.type === "user" ? prev + 1 : prev),
      0
    );

    return {
      handlersQuantity: quantityOfHandlers,
      usersQuantity: quantityOfUsers,
    };
  }, [solicitations]);

  return (
    <section className={styles.mapSection}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.badge}>
            <BsGeoAlt className={styles.badgeIcon} />
            <span>Mapa de Doações</span>
          </div>
        </div>

        <a href="/solicitacoes" className={styles.viewAllButton}>
          <BsHeart className={styles.buttonIcon} />
          <span className={styles.buttonText}>
            Ver todas as {solicitations.length} solicitações
          </span>
          <BsArrowRight className={styles.arrowIcon} />
        </a>
      </div>

      <div className={styles.mapContainer}>
        <Map markers={markers} />
      </div>
    </section>
  );
};
