"use client";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./styles.module.scss";
import { useGeolocation } from "@/hooks/useGeolocation";
import CustomMarker from "@/features/Home/components/Map/Marker";
import { MapLoading } from "@/components/MapLoading";
import L from "leaflet";
import { useMemo } from "react";

export interface MapProps {
  markers: {
    location: {
      latitude: number;
      longitude: number;
    };
    tooltip?: string | React.FunctionComponent;
    onClick: () => void;
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

  if (!currentPosition && center === null) {
    return <MapLoading height={height} message="Obtendo sua localização..." />;
  }

  const centerPosition: [number, number] = center
    ? [center.latitude, center.longitude]
    : [currentPosition?.latitude ?? 0, currentPosition?.longitude ?? 0];

  return (
    <div className={`${styles.mapContainer} ${className}`} style={{ height }}>
      <MapContainer
        className={styles.mapContainer}
        style={{ height }}
        center={centerPosition}
        zoom={15}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          icon={L.icon({
            iconUrl: "/assets/images/icons/pin-user.svg",
            iconSize: [60, 60],
            iconAnchor: [30, 60],
            popupAnchor: [0, -32],
            tooltipAnchor: [10, -30],
          })}
          position={[
            currentPosition?.latitude ?? 0,
            currentPosition?.longitude ?? 0,
          ]}
        >
          <Tooltip>Você está aqui</Tooltip>
        </Marker>

        {markers.length > 0 &&
          markers.map((marker) => (
            <CustomMarker
              key={`${marker.location.latitude}-${marker.location.longitude}-${
                Math.random() * 100
              }`}
              lat={marker.location.latitude}
              lng={marker.location.longitude}
              label={marker.tooltip}
              onClick={marker.onClick}
            />
          ))}
      </MapContainer>
    </div>
  );
}
