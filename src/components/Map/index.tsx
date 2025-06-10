"use client";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import styles from "./styles.module.scss";
import { Location, Solicitation } from "@/interfaces/Solicitations.interface";
import { useRouter } from "next/navigation";
import UserPin from "./UserPin";
import { useUserGeolocation } from "@/hooks/useUserGeolocation";
import { useEffect } from "react";
import EmptyMap from "./EmptyMap";

export interface BaseLocation {
  location: Location | null;
}
export interface IMarker {
  id: number;
  location: Location;
}
export interface IGoogleMapsProps {
  solicitations?: Solicitation[];
  zoom?: number;
  className?: string;
}

export default function GoogleMaps({
  className,
  solicitations,
  zoom,
}: IGoogleMapsProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}>
      <BaseGoogleMaps
        className={className}
        solicitations={solicitations}
        zoom={zoom}
      />
    </APIProvider>
  );
}

export function BaseGoogleMaps({
  solicitations = [],
  zoom = 15,
  className,
}: IGoogleMapsProps) {
  const userLocation = useUserGeolocation();
  const router = useRouter();
  const map = useMap();

  useEffect(() => {
    if (!map || solicitations.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    const baseUserLocation: BaseLocation = { location: userLocation };

    [baseUserLocation, ...solicitations].forEach((solicitation) => {
      if (!solicitation.location) return;

      bounds.extend(solicitation.location);
    });

    map.fitBounds(bounds);
  }, [map, solicitations]);

  return (
    <Map
      className={`${styles.map} ${className}`}
      defaultCenter={{
        lat: userLocation?.lat ?? 0,
        lng: userLocation?.lng ?? 0,
      }}
      defaultZoom={zoom}
      minZoom={3}
      mapId="any-map-id"
      gestureHandling={"greedy"}
      reuseMaps
      disableDefaultUI={true}
    >
      <AdvancedMarker position={userLocation}>
        <UserPin />
      </AdvancedMarker>

      {solicitations?.map((solicitation) => (
        <AdvancedMarker
          position={{
            lat: solicitation.location.lat,
            lng: solicitation.location.lng,
          }}
          key={solicitation.id}
          onClick={() =>
            router.push(`/visualizar-solicitacao/${solicitation.id}`)
          }
        ></AdvancedMarker>
      ))}
    </Map>
  );
}
