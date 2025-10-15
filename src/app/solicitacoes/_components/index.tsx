"use client";

import SolicitationMapSection from "@/features/Solicitations/components/Map";
import { SolicitationCard } from "@/features/Solicitations/components/SolicitationCard";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useMemo, useState } from "react";
import { BsSearch, BsFilter } from "react-icons/bs";
import styles from "./styles.module.scss";

export default function SolicitationsComponent({
  data,
}: {
  data: Solicitation[];
}) {
  const [search, setSearch] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState<string>("all");

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const filteredData = useMemo(() => {
    return data.filter((donation) => {
      const matchesSearch = donation.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesBloodType =
        selectedBloodType === "all" || donation.bloodType === selectedBloodType;
      return matchesSearch && matchesBloodType;
    });
  }, [data, search, selectedBloodType]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.filtersSection}>
        <div className={styles.searchWrapper}>
          <BsSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <BsFilter className={styles.filterIcon} />
            <span>Filtrar por tipo sanguíneo:</span>
          </div>
          <div className={styles.bloodTypeFilters}>
            <button
              className={`${styles.filterButton} ${
                selectedBloodType === "all" ? styles.active : ""
              }`}
              onClick={() => setSelectedBloodType("all")}
            >
              Todos
            </button>
            {bloodTypes.map((type) => (
              <button
                key={type}
                className={`${styles.filterButton} ${
                  selectedBloodType === type ? styles.active : ""
                }`}
                onClick={() => setSelectedBloodType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.resultsCount}>
          <span className={styles.count}>{filteredData.length}</span>
          <span className={styles.label}>
            {filteredData.length === 1
              ? "solicitação encontrada"
              : "solicitações encontradas"}
          </span>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.solicitationsList}>
          {filteredData.length > 0 ? (
            filteredData.map((donation, index) => (
              <SolicitationCard
                id={donation.id}
                key={index}
                name={donation.name}
                image={donation?.image}
                bloodType={donation.bloodType}
              />
            ))
          ) : (
            <div className={styles.emptyResults}>
              <p>Nenhuma solicitação encontrada com os filtros aplicados.</p>
            </div>
          )}
        </div>

        <div className={styles.mapContainer}>
          <div className={styles.mapWrapper}>
            <SolicitationMapSection solicitations={filteredData ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
