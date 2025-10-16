"use client";

import styles from "./styles.module.scss";
import Map from "@/components/Map";

export type IViewSolicitationMapSectionProps = {
  center?: {
    latitude: number;
    longitude: number;
  };
  marker: {
    location: {
      latitude: number;
      longitude: number;
    };
    tooltip?: string;
  };
};

export default function ViewSolicitationMapSection({
  center,
  marker,
}: IViewSolicitationMapSectionProps) {
  return (
    <Map
      markers={[
        {
          location: marker.location,
          onClick: () => {},
          tooltip: marker.tooltip,
        },
      ]}
      center={center}
      className={styles.viewSolicitationsMap}
    />
  );
}
