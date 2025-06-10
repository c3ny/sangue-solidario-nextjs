"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import styles from "./styles.module.scss";
import { Location } from "@/interfaces/Solicitations.interface";
import UserPin from "./UserPin";
import { useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

export interface BaseLocation {
  location: Location | null;
}
export interface IMarker {
  id: number;
  location: Location;
}

export interface IMarkerProps {
  location: Location | null;
  onClick?: () => void;
}

export interface IGoogleMapsProps {
  markers?: IMarkerProps[];
  zoom?: number;
  className?: string;
}

export default function GoogleMaps({
  className,
  markers,
  zoom,
}: IGoogleMapsProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}>
      <BaseGoogleMaps className={className} markers={markers} zoom={zoom} />
    </APIProvider>
  );
}

export function BaseGoogleMaps({
  markers = [],
  zoom = 15,
  className,
}: IGoogleMapsProps) {
  const { currentPosition } = useGeolocation();

  const map = useMap();

  useEffect(() => {
    if (!map || markers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    const baseUserLocation: BaseLocation = {
      location: {
        lat: currentPosition.latitude,
        lng: currentPosition.longitude,
      },
    };

    [baseUserLocation, ...markers].forEach((solicitation) => {
      if (!solicitation.location) return;

      bounds.extend(solicitation.location);
    });

    map.fitBounds(bounds);
  }, [map, currentPosition, markers]);

  return (
    <Map
      className={`${styles.map} ${className}`}
      defaultCenter={{
        lat: currentPosition.latitude,
        lng: currentPosition.longitude,
      }}
      defaultZoom={zoom}
      minZoom={3}
      mapId="any-map-id"
      gestureHandling={"greedy"}
      reuseMaps
      disableDefaultUI={true}
    >
      <AdvancedMarker
        position={{
          lat: currentPosition.latitude,
          lng: currentPosition.longitude,
        }}
      >
        <UserPin />
      </AdvancedMarker>

      {markers?.map((marker) => (
        <AdvancedMarker
          position={{
            lat: marker.location?.lat ?? 0,
            lng: marker.location?.lng ?? 0,
          }}
          key={`${Math.random()}-${marker.location?.lat}-${
            marker.location?.lng
          }`}
          onClick={marker.onClick}
        ></AdvancedMarker>
      ))}
    </Map>
  );
}
