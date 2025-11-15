"use client";
import { MapContext } from "./MapContext";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export interface MapProviderProps {
  children?: React.ReactNode;
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  center?: [number, number];
  zoom?: number;
  style?: string;
}

export function MapProvider({
  children,
  mapContainerRef,
  center = [-46.6333, -23.5505],
  zoom = 12,
  style = "mapbox://styles/mapbox/streets-v12",
}: MapProviderProps) {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style,
      center,
      zoom,
    });

    map.current.on("load", () => {
      setMapReady(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapReady(false);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapContainerRef, style]);

  useEffect(() => {
    if (!map.current || !mapReady) return;
    map.current.setCenter(center);
    map.current.setZoom(zoom);
  }, [center, zoom, mapReady]);

  return (
    <MapContext.Provider value={{ map: map.current }}>
      {children}
    </MapContext.Provider>
  );
}
