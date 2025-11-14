"use client";
import { useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./styles.module.scss";
import { useGeolocation } from "@/hooks/useGeolocation";
import { CustomMarkerIconType } from "@/features/Home/components/Map/Marker";
import { MapProvider } from "@/contexts/Map/MapContext.client";
import { MapContent } from "./MapContent";

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
}

export default function Map({
  markers = [],
  className,
  height = 600,
  center = null,
}: MapProps) {
  const { currentPosition } = useGeolocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const DEFAULT_CENTER: [number, number] = [-46.6333, -23.5505];

  const centerPosition: [number, number] = center
    ? [center.longitude, center.latitude]
    : currentPosition
    ? [currentPosition.longitude, currentPosition.latitude]
    : DEFAULT_CENTER;

  const initialZoom = center || currentPosition ? 15 : 12;

  return (
    <div
      className={`${styles.mapContainer} ${className}`}
      style={{ height }}
      ref={mapContainerRef}
    >
      <MapProvider
        mapContainerRef={mapContainerRef}
        center={centerPosition}
        zoom={initialZoom}
      >
        <MapContent markers={markers} currentPosition={currentPosition} />
      </MapProvider>
    </div>
  );
}
