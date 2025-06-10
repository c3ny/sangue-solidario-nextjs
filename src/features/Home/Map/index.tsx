import GoogleMaps from "@/components/Map";
import styles from "./styles.module.scss";
import { Solicitation } from "@/interfaces/Solicitations.interface";

export interface IMapSectionProps {
  solicitations: Solicitation[];
}

export const MapSection = ({ solicitations }: IMapSectionProps) => {
  return (
    <div>
      <div>
        <h2>
          12 hemocentros e {solicitations.length} pessoas precisam da sua ajuda!
        </h2>
        <div className={styles.mapContainer}>
          <GoogleMaps solicitations={solicitations} />
        </div>
      </div>
    </div>
  );
};
