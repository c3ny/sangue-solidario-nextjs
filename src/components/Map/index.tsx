"use client";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import styles from "./styles.module.scss";
import { Location } from "@/interfaces/Solicitations.interface";
import { useRouter } from "next/navigation";

export interface IMarker {
  id: number;
  location: Location;
}
export interface IGoogleMapsProps {
  markers?: IMarker[];
  zoom?: number;
  className?: string;
}

export default function GoogleMaps({
  markers,
  zoom = 15,
  className,
}: IGoogleMapsProps) {
  const router = useRouter();

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
          <Marker
            position={{
              lat: marker.location.lat,
              lng: marker.location.lng,
            }}
            key={marker.id}
            onClick={() => router.push(`/visualizar-solicitacao/${marker.id}`)}
          />
        ))}
      </Map>
    </APIProvider>
  );
}
