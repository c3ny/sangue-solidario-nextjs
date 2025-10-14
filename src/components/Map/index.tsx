"use client";
import { MapContainer, TileLayer, useMap, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./styles.module.scss";
import { useGeolocation } from "@/hooks/useGeolocation";
import CustomMarker from "@/features/Home/components/Map/Marker";
import { useEffect } from "react";

export interface MapProps {
  markers: {
    location: {
      latitude: number;
      longitude: number;
    };
    onClick: () => void;
  }[];
}

export default function Map({ markers = [] }: MapProps) {
  const { currentPosition } = useGeolocation();

  if (!currentPosition) {
    return null;
  }

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={styles.mapContainer}
        center={[currentPosition?.latitude, currentPosition.longitude]}
        zoom={15}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[currentPosition?.latitude, currentPosition?.longitude]}
        />

        {currentPosition &&
          markers.map((marker) => (
            <CustomMarker
              key={`${marker.location.latitude}-${marker.location.longitude}-${
                Math.random() * 100
              }`}
              lat={marker.location.latitude}
              lng={marker.location.longitude}
              onClick={marker.onClick}
            />
          ))}
      </MapContainer>
    </div>
  );
}
