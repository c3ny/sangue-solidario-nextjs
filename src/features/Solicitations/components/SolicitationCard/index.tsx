import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { BsDroplet, BsArrowRight, BsGeoAlt } from "react-icons/bs";
import Link from "next/link";
import styles from "./styles.module.scss";
import { formatDistance } from "@/utils/distance";

export interface ISolicitationCardProps {
  name: string;
  bloodType: string;
  image?: string;
  id: number;
  distance?: number;
}

/**
 * SolicitationCard Component
 * Displays a blood donation solicitation with patient info
 */
export const SolicitationCard = ({
  name,
  bloodType,
  image,
  id,
  distance,
}: ISolicitationCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {image ? (
          <img
            className={styles.image}
            src={image}
            alt={`Foto de ${name}`}
            width={70}
            height={70}
          />
        ) : (
          <ImagePlaceholder className={styles.imagePlaceholder} />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.info}>
          <div className={styles.bloodType}>
            <BsDroplet className={styles.bloodIcon} />
            <span className={styles.bloodText}>{bloodType}</span>
          </div>
          {distance === Infinity && (
            <div className={styles.distance}>
              <BsGeoAlt className={styles.distanceIcon} />
              <span className={styles.distanceText}>
                Distância não disponível
              </span>
            </div>
          )}

          {distance !== undefined && distance !== Infinity && (
            <div className={styles.distance}>
              <BsGeoAlt className={styles.distanceIcon} />
              <span className={styles.distanceText}>
                {formatDistance(distance)}
              </span>
            </div>
          )}
        </div>
      </div>

      <Link
        href={`/visualizar-solicitacao/${id}`}
        className={styles.actionButton}
      >
        <span>Quero doar</span>
        <BsArrowRight className={styles.arrowIcon} />
      </Link>
    </div>
  );
};
