"use client";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import styles from "./styles.module.scss";
import { Location } from "@/interfaces/Solicitations.interface";

export interface IGoogleMapsProps {
  markers?: Location[];
  zoom?: number;
  className?: string;
}

export default function GoogleMaps({
  markers,
  zoom = 15,
  className,
}: IGoogleMapsProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}>
      <Map
        className={`${styles.map} ${className}`}
        defaultCenter={{ lat: -23.470061709979536, lng: -47.48293325972532 }}
        defaultZoom={zoom}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {markers?.map((marker) => (
          <Marker position={marker} key={marker.lat} />
        ))}
      </Map>
    </APIProvider>
  );
}
