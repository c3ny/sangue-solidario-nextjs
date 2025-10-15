import { BsGeoAlt } from "react-icons/bs";
import styles from "./styles.module.scss";

export interface IMapLoadingProps {
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Width of the loading container
   */
  width?: string;
  /**
   * Height of the loading container
   */
  height?: string | number;
  /**
   * Loading message to display
   */
  message?: string;
}

export const MapLoading = ({
  className,
  width = "100%",
  height = 600,
  message = "Carregando mapa...",
}: IMapLoadingProps) => {
  return (
    <div
      className={`${styles.mapLoadingContainer} ${className || ""}`}
      style={{ width, height }}
    >
      <div className={styles.mapSkeleton}>
        <div className={`${styles.marker} ${styles.marker1}`}>
          <BsGeoAlt className={styles.markerIcon} />
        </div>
        <div className={`${styles.marker} ${styles.marker2}`}>
          <BsGeoAlt className={styles.markerIcon} />
        </div>
        <div className={`${styles.marker} ${styles.marker3}`}>
          <BsGeoAlt className={styles.markerIcon} />
        </div>
      </div>

      <div className={styles.loadingContent}>
        <div className={styles.spinner}>
          <BsGeoAlt className={styles.spinnerIcon} />
        </div>
        <p className={styles.loadingMessage}>{message}</p>
        <div className={styles.loadingDots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
      </div>
    </div>
  );
};
