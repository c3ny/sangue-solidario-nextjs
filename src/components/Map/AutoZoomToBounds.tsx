import { MapProps } from ".";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { useGeolocation } from "@/hooks/useGeolocation";

export function AutoZoomToBounds({ markers }: MapProps) {
  const { currentPosition } = useGeolocation();
  const map = useMap();

  useEffect(() => {
    if (!map || !currentPosition) return;

    const bounds = L.latLngBounds([]);

    if (
      typeof currentPosition?.latitude === "number" &&
      typeof currentPosition?.longitude === "number"
    ) {
      console.log("currentPosition", currentPosition);
      bounds.extend([currentPosition.latitude, currentPosition.longitude]);
    }

    markers.forEach((marker) => {
      bounds.extend([marker.location.latitude, marker.location.longitude]);
    });

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });
  }, [map, markers, currentPosition]);

  return null;
}
