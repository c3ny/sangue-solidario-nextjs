"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BsBuilding, BsGeoAlt, BsSearch } from "react-icons/bs";
import { IInstitutionCard } from "@/features/Institution/interfaces/InstitutionCard.interface";
import styles from "./styles.module.scss";

const TYPE_LABELS: Record<string, string> = {
  BLOOD_CENTER: "Hemocentro",
  HOSPITAL: "Hospital",
  CLINIC: "Clínica",
};

interface HemocentrosListClientProps {
  initialInstitutions: IInstitutionCard[];
}

export function HemocentrosListClient({
  initialInstitutions,
}: HemocentrosListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return initialInstitutions;
    return initialInstitutions.filter((inst) => {
      return (
        inst.institutionName.toLowerCase().includes(term) ||
        (inst.city ?? "").toLowerCase().includes(term) ||
        (inst.uf ?? "").toLowerCase().includes(term)
      );
    });
  }, [initialInstitutions, searchTerm]);

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Hemocentros e instituições</h1>
          <p className={styles.subtitle}>
            Encontre um hemocentro próximo a você, conheça suas campanhas ativas
            e agende sua doação.
          </p>
        </header>

        <div className={styles.searchWrapper}>
          <BsSearch className={styles.searchIcon} aria-hidden />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Buscar por nome, cidade ou UF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar hemocentros"
          />
        </div>

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {initialInstitutions.length === 0
                ? "Nenhum hemocentro cadastrado no momento."
                : "Nenhum hemocentro corresponde à sua busca."}
            </p>
          </div>
        ) : (
          <div className={styles.grid} role="list">
            {filtered.map((inst) => (
              <HemocentroCard key={inst.id} institution={inst} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function HemocentroCard({ institution }: { institution: IInstitutionCard }) {
  const typeLabel = TYPE_LABELS[institution.type ?? ""] ?? "Hemocentro";

  return (
    <Link
      href={`/hemocentro/${institution.slug}`}
      className={styles.card}
      role="listitem"
    >
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
