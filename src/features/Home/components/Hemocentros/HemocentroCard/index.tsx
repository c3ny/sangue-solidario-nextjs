import Link from "next/link";
import Image from "next/image";
import { BsBuilding, BsGeoAlt } from "react-icons/bs";
import { IInstitutionCard } from "@/features/Institution/interfaces/InstitutionCard.interface";
import styles from "./styles.module.scss";

const TYPE_LABELS: Record<string, string> = {
  BLOOD_CENTER: "Hemocentro",
  HOSPITAL: "Hospital",
  CLINIC: "Clinica",
};

interface HemocentroCardProps {
  institution: IInstitutionCard;
}

export function HemocentroCard({ institution }: HemocentroCardProps) {
  const typeLabel = TYPE_LABELS[institution.type ?? ""] ?? "Hemocentro";

  return (
    <Link href={`/hemocentro/${institution.slug}`} className={styles.card}>
      <div className={styles.logoWrapper}>
        {institution.logoImage ? (
          <Image
            src={institution.logoImage}
            alt={institution.institutionName}
            width={72}
            height={72}
            className={styles.logoImage}
          />
        ) : (
          <BsBuilding className={styles.placeholderIcon} />
        )}
      </div>

      <span className={styles.name}>{institution.institutionName}</span>

      {(institution.city || institution.uf) && (
        <span className={styles.location}>
          <BsGeoAlt className={styles.locationIcon} />
          {[institution.city, institution.uf].filter(Boolean).join("/")}
        </span>
      )}

      <span className={styles.typeBadge}>{typeLabel}</span>
    </Link>
  );
}
