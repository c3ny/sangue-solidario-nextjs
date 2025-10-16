"use client";
import styles from "./styles.module.scss";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MapLoading } from "@/components/MapLoading";
import { BsArrowRight, BsGeoAlt, BsHeart } from "react-icons/bs";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <MapLoading width="100%" height="600px" message="Carregando mapa..." />
  ),
});

export interface IMapSectionProps {
  solicitations: Solicitation[];
  donationsCount: number;
}

export const MapSection = ({
  solicitations,
  donationsCount,
}: IMapSectionProps) => {
  const router = useRouter();

  const markers = solicitations?.map((solicitation) => ({
    location: solicitation.location,
    tooltip: solicitation.name,
    onClick: () => {
      router.push(`/visualizar-solicitacao/${solicitation.id}`);
    },
  }));

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
            Ver todas as {donationsCount} solicitações
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
