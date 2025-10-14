"use client";

import SolicitationMapSection from "@/features/Solicitations/components/Map";
import { SolicitationCard } from "@/features/Solicitations/components/SolicitationCard";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useMemo, useState } from "react";
import styles from "./styles.module.scss";

export default function SolicitationsComponent({
  data,
}: {
  data: Solicitation[];
}) {
  const [search, setSearch] = useState("");
  const filteredData = useMemo(() => {
    return data.filter((donation) =>
      donation.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  return (
    <>
      <div className="row">
        <div className="col">
          <input
            type="text"
            className="form-control"
            id="nomeCompleto"
            placeholder="Nome completo"
            required
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="row flex-lg-row g-5 py-5 mb-5">
        <div
          id="solicitationsCards"
          className={`col-lg-6 justify-content-start ${styles.solicitationsComponent}`}
        >
          {filteredData?.map((donation, index) => (
            <SolicitationCard
              id={donation.id}
              key={index}
              name={donation.name}
              image={donation?.image}
              bloodType={donation.bloodType}
            />
          ))}
        </div>
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <SolicitationMapSection solicitations={filteredData ?? []} />
        </div>
      </div>
    </>
  );
}
