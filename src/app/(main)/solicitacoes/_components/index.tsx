"use client";

import { SolicitationCard } from "@/features/Solicitations/components/SolicitationCard";
import { PaginatedResult } from "@/types/pagination.types";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useMemo, useState } from "react";
import { BsSearch, BsFilter } from "react-icons/bs";
import styles from "./styles.module.scss";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { MapLoading } from "@/components/MapLoading";
import { Pagination } from "@/components/Pagination";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <MapLoading
      width="100%"
      height="900px"
      message="Carregando mapa de doações..."
    />
  ),
});

export default function SolicitationsComponent({
  paginatedData,
  donationsCount,
}: {
  paginatedData: PaginatedResult<Solicitation>;
  donationsCount: number;
}) {
  const { data, metadata } = paginatedData;
  const [search, setSearch] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState<string>("all");
  const router = useRouter();
  const searchParams = useSearchParams();
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/solicitacoes?${params.toString()}`);
  };

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

  const markers = filteredData.map((solicitation) => {
    return {
      location: solicitation.location,
      tooltip: solicitation.name,
      onClick: () => router.push(`/visualizar-solicitacao/${solicitation.id}`),
    };
  });
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
          <span className={styles.count}>{donationsCount}</span>
          <span className={styles.label}>
            {donationsCount === 1
              ? "solicitação encontrada"
              : "solicitações encontradas"}
          </span>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.solicitationsList}>
          {filteredData.length > 0 ? (
            <>
              {filteredData.map((donation, index) => (
                <SolicitationCard
                  id={donation.id}
                  key={index}
                  name={donation.name}
                  image={donation?.image}
                  bloodType={donation.bloodType}
                />
              ))}
              <div className={styles.paginationWrapper}>
                <Pagination
                  currentPage={metadata.page}
                  totalPages={metadata.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className={styles.emptyResults}>
              <p>Nenhuma solicitação encontrada com os filtros aplicados.</p>
            </div>
          )}
        </div>

        <div className={styles.mapContainer}>
          <div className={styles.mapWrapper}>
            <Map markers={markers ?? []} className={styles.map} height={900} />
          </div>
        </div>
      </div>
    </div>
  );
}
