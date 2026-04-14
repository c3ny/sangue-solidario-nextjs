"use client";
import { useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./styles.module.scss";
import { useGeolocation } from "@/hooks/useGeolocation";
import { CustomMarkerIconType } from "@/features/Home/components/Map/Marker";
import { MapProvider } from "@/contexts/Map/MapContext.client";
import { MapContent } from "./MapContent";
import { SearchControl } from "./SearchControl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export interface MapProps {
  markers: {
    location: {
      latitude: number;
      longitude: number;
    };
    tooltip?: string | React.FunctionComponent;
    onClick: () => void;
    iconType?: CustomMarkerIconType;
  }[];
  center?: null | {
    latitude: number;
    longitude: number;
  };
  height?: string | number;
  className?: string;
  /**
   * Disables the auto-geolocation control (and the auto-trigger that
   * re-centers the map on the user). Use for read-only views where you
   * want the map to stay centered on the provided `center`.
   */
  disableGeolocate?: boolean;
  /** Hide search control. Useful for read-only views. */
  showSearchControl?: boolean;
}

export default function Map({
  markers = [],
  className,
  height = 600,
  center = null,
  disableGeolocate = false,
  showSearchControl = true,
}: MapProps) {
  const { currentPosition } = useGeolocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const DEFAULT_CENTER: [number, number] = [-46.6333, -23.5505];

  const centerPosition: [number, number] = center
    ? [center.longitude, center.latitude]
    : currentPosition
    ? [currentPosition.longitude, currentPosition.latitude]
    : DEFAULT_CENTER;

  const initialZoom = center || currentPosition ? 12 : 8;

  return (
    <div
      className={`${styles.mapContainer} ${className}`}
      style={{ height, position: "relative" }}
      ref={mapContainerRef}
    >
      <MapProvider
        mapContainerRef={mapContainerRef}
        center={centerPosition}
        zoom={initialZoom}
        disableGeolocate={disableGeolocate}
      >
        {showSearchControl && <SearchControl />}
        <MapContent
          markers={markers}
          currentPosition={disableGeolocate ? null : currentPosition}
        />
      </MapProvider>
    </div>
  );
}
