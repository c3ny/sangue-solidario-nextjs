import React from "react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { BsDroplet, BsArrowRight, BsGeoAlt } from "react-icons/bs";
import Link from "next/link";
import styles from "./styles.module.scss";
import { formatDistance } from "@/utils/distance";
import { APIService } from "@/service/api/api";

export interface ISolicitationCardProps {
  name: string;
  bloodType: string;
  quantity?: number;
  image?: string;
  id: string | number;
  distance?: number;
  onClick?: () => void;
}

export const SolicitationCard = React.memo(function SolicitationCard({
  name,
  bloodType,
  quantity,
  image,
  id,
  distance,
  onClick,
}: ISolicitationCardProps) {
  const apiService = new APIService();

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.image}
            src={apiService.getDonationFileServiceUrl(image || "")}
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
            {quantity && (
              <span className={styles.bloodText}>
                {" "}· {quantity} bolsa{quantity > 1 ? "s" : ""}
              </span>
            )}
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
});