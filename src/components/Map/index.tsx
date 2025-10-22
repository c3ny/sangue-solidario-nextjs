"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./styles.module.scss";
import { useGeolocation } from "@/hooks/useGeolocation";
import CustomMarker from "@/features/Home/components/Map/Marker";
import { MapLoading } from "@/components/MapLoading";
import L from "leaflet";
import { useEffect } from "react";

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
  autoZoom?: boolean;
}

/**
 * AutoZoomToBounds Component
 * Automatically adjusts the map zoom to fit all markers and user location
 * Based on Leaflet's fitBounds method: https://leafletjs.com/reference.html#map-fitbounds
 */
interface AutoZoomToBoundsProps {
  markers: MapProps["markers"];
  userPosition: { latitude: number; longitude: number } | null;
}

function AutoZoomToBounds({ markers, userPosition }: AutoZoomToBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || markers.length === 0) return;

    const bounds = L.latLngBounds([]);

    if (userPosition) {
      bounds.extend([userPosition.latitude, userPosition.longitude]);
    }

    markers.forEach((marker) => {
      if (
        marker.location &&
        typeof marker.location.latitude === "number" &&
        typeof marker.location.longitude === "number"
      ) {
        bounds.extend([marker.location.latitude, marker.location.longitude]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
        duration: 1,
      });
    }
  }, [map, markers, userPosition]);

  return null;
}


export default function Map({
  markers = [],
  className,
  height = 600,
  center = null,
  autoZoom = true,
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

        {autoZoom && markers.length > 0 && (
          <AutoZoomToBounds markers={markers} userPosition={currentPosition} />
        )}

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

        {markers
          .filter(
            (m) =>
              m.location &&
              typeof m.location.latitude === "number" &&
              typeof m.location.longitude === "number"
          )
          .map((marker) => (
            <CustomMarker
              key={`${marker.location.latitude}-${marker.location.longitude}-${Math.random() * 100}`}
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
