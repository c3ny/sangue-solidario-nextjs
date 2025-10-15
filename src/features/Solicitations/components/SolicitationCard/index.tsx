import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { BsDroplet, BsArrowRight } from "react-icons/bs";
import Link from "next/link";
import styles from "./styles.module.scss";

export interface ISolicitationCardProps {
  name: string;
  bloodType: string;
  image?: string;
  id: number;
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
}: ISolicitationCardProps) => {
  return (
    <div className={styles.card}>
      {/* Patient Image */}
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

      {/* Patient Info */}
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.bloodType}>
          <BsDroplet className={styles.bloodIcon} />
          <span className={styles.bloodText}>{bloodType}</span>
        </div>
      </div>

      {/* Action Button */}
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
