"use client";
import { MapProps } from ".";
import mapboxgl from "mapbox-gl";
import { useMap } from "@/contexts/Map/MapContext";
import { useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";

export function AutoZoomToBounds({ markers }: MapProps) {
  const { currentPosition } = useGeolocation();
  const { map } = useMap();

  useEffect(() => {
    if (!map || markers.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();

    if (
      currentPosition &&
      typeof currentPosition.latitude === "number" &&
      typeof currentPosition.longitude === "number"
    ) {
      bounds.extend([currentPosition.longitude, currentPosition.latitude]);
    }

    markers.forEach((marker) => {
      if (
        marker.location &&
        typeof marker.location.latitude === "number" &&
        typeof marker.location.longitude === "number"
      ) {
        bounds.extend([marker.location.longitude, marker.location.latitude]);
      }
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 1000,
      });
    }
  }, [map, markers, currentPosition]);

  return null;
}
