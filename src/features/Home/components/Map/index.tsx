"use client";
import styles from "./styles.module.scss";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MapLoading } from "@/components/MapLoading";
import { Badge } from "@/components/Badge";
import { BsArrowRight, BsGeoAlt } from "react-icons/bs";
import { useGeolocation } from "@/hooks/useGeolocation";
import { sortByProximity } from "@/utils/distance";

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
  const { currentPosition } = useGeolocation();

  const filteredSolicitations = solicitations?.filter(
    (solicitation) =>
      typeof solicitation.location.latitude != "undefined" &&
      typeof solicitation.location.longitude != "undefined"
  );

  const sortedSolicitations =
    filteredSolicitations.length > 0
      ? sortByProximity(filteredSolicitations, currentPosition)
      : [];

  const markers = sortedSolicitations.map((solicitation) => ({
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
          <Badge icon={<BsGeoAlt />} variant="danger">
            Mapa de Doações
          </Badge>
        </div>

        <a href="/solicitacoes" className={styles.viewAllLink}>
          Ver todas as {donationsCount} solicitações
          <BsArrowRight className={styles.arrowIcon} />
        </a>
      </div>

      <div className={styles.mapContainer}>
        <Map markers={markers} />
      </div>
    </section>
  );
};
