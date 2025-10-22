"use client";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./styles.module.scss";
import { useGeolocation } from "@/hooks/useGeolocation";
import CustomMarker from "@/features/Home/components/Map/Marker";
import { SearchControl } from "./SearchControl";
import L from "leaflet";
import { AutoZoomToBounds } from "./AutoZoomToBounds";

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
  enableSearch?: boolean;
}

export default function Map({
  markers = [],
  className,
  height = 600,
  center = null,
  autoZoom = true,
  enableSearch = true,
}: MapProps) {
  const { currentPosition } = useGeolocation();

  const DEFAULT_CENTER: [number, number] = [-23.5505, -46.6333];

  const centerPosition: [number, number] = center
    ? [center.latitude, center.longitude]
    : currentPosition
    ? [currentPosition.latitude, currentPosition.longitude]
    : DEFAULT_CENTER;

  const initialZoom = center || currentPosition ? 15 : 12;

  return (
    <div className={`${styles.mapContainer} ${className}`} style={{ height }}>
      <MapContainer
        className={styles.mapContainer}
        style={{ height }}
        center={centerPosition}
        zoom={initialZoom}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {enableSearch && <SearchControl />}

        {autoZoom && markers.length > 0 && (
          <AutoZoomToBounds markers={markers} />
        )}

        {currentPosition && (
          <Marker
            icon={L.icon({
              iconUrl: "/assets/images/icons/pin-user.svg",
              iconSize: [60, 60],
              iconAnchor: [30, 60],
              popupAnchor: [0, -32],
              tooltipAnchor: [10, -30],
            })}
            position={[currentPosition.latitude, currentPosition.longitude]}
          >
            <Tooltip>Você está aqui</Tooltip>
          </Marker>
        )}

        {markers
          .filter(
            (m) =>
              m.location &&
              typeof m.location.latitude === "number" &&
              typeof m.location.longitude === "number"
          )
          .map((marker) => (
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
