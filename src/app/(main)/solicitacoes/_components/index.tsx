"use client";

import { SolicitationCard } from "@/features/Solicitations/components/SolicitationCard";
import { PaginatedResult } from "@/types/pagination.types";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useMemo, useState } from "react";
import { BsSearch, BsFilter } from "react-icons/bs";
import { ButtonFilterSelector } from "@/components/ButtonFilterSelector";
import styles from "./styles.module.scss";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { MapLoading } from "@/components/MapLoading";
import { Pagination } from "@/components/Pagination";
import { useGeolocation } from "@/hooks/useGeolocation";
import { sortByProximity } from "@/utils/distance";
import { CustomMarkerIconType } from "@/features/Home/components/Map/Marker";

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
  const { currentPosition } = useGeolocation();

  const bloodTypeOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    router.push(`/solicitacoes?${params.toString()}`);
  };

  const filteredData = useMemo(() => {
    const filtered = data.filter((donation) => {
      const matchesSearch = donation.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesBloodType =
        selectedBloodType === "all" || donation.bloodType === selectedBloodType;
      return matchesSearch && matchesBloodType;
    });

    return sortByProximity(filtered, currentPosition);
  }, [data, search, selectedBloodType, currentPosition]);

  const markers = filteredData
    .filter(
      (
        s
      ): s is typeof s & {
        location: { latitude: number; longitude: number };
      } =>
        s.location !== undefined &&
        typeof s.location.latitude === "number" &&
        typeof s.location.longitude === "number"
    )
    .map((solicitation) => ({
      location: solicitation.location,
      tooltip: solicitation.name,
      onClick: () => router.push(`/visualizar-solicitacao/${solicitation.id}`),
      iconType: CustomMarkerIconType.PERSON,
    }));

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
          <ButtonFilterSelector
            options={bloodTypeOptions}
            value={selectedBloodType}
            onChange={setSelectedBloodType}
            allOption={{ value: "all", label: "Todos" }}
            ariaLabel="Filtrar por tipo sanguíneo"
          />
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
                  distance={donation.distance}
                  onClick={() =>
                    router.push(`/visualizar-solicitacao/${donation.id}`)
                  }
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
