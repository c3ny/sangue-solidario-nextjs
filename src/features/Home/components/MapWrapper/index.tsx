import { MapSection } from "@/features/Home/components/Map";
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
      <MapWithData />
    </div>
  );
}
