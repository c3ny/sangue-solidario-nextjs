import { Suspense } from "react";
import { MapSection } from "@/features/Home/components/Map";
import { MapLoading } from "@/components/MapLoading";
import donationsService from "@/features/Solicitations/services/donations.service";
import styles from "./styles.module.scss";

async function MapWithData() {
  const [donations] = await Promise.all([donationsService.getDonations()]);

  return (
    <MapSection
      solicitations={donations.data}
      donationsCount={donations.metadata.total}
    />
  );
}

export function MapWrapper() {
  return (
    <div className={styles.mapWrapper}>
      <Suspense
        fallback={
          <MapLoading
            width="100%"
            height="600px"
            message="Carregando solicitações..."
          />
        }
      >
        <MapWithData />
      </Suspense>
    </div>
  );
}
