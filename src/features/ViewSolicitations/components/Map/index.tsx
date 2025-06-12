"use client";

import GoogleMaps from "@/components/Map";
import { useMemo } from "react";
import styles from "./styles.module.scss";
import { MapLocation } from "../../interfaces/Map.interfaces";

export type IViewSolicitationMapSectionProps = MapLocation;

export default function ViewSolicitationMapSection({
  location,
}: IViewSolicitationMapSectionProps) {
  const markers: MapLocation[] = useMemo(() => {
    return [{ location: location }];
  }, []);

  return (
    <GoogleMaps markers={markers} className={styles.viewSolicitationsMap} />
  );
}
