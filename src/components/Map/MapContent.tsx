import { MapProps } from ".";
import { useMap } from "@/contexts/Map/MapContext";
import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./styles.module.scss";
import CustomMarker from "./CustomMarker";

export function MapContent({
  markers,
  currentPosition,
}: {
  markers: MapProps["markers"];
  currentPosition: { latitude: number; longitude: number } | null;
}) {
  const { map } = useMap();
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !currentPosition) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      return;
    }

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const el = document.createElement("div");

    el.className = styles.userMarker;
    el.style.width = "60px";
    el.style.height = "60px";
    el.style.backgroundImage = "url(/assets/images/icons/pin-user.svg)";
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "center";
    el.style.cursor = "pointer";

    userMarkerRef.current = new mapboxgl.Marker(el)
      .setLngLat([currentPosition.longitude, currentPosition.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(
          "<p>Você está aqui</p>"
        )
      )
      .addTo(map);

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
    };
  }, [map, currentPosition]);

  return (
    <div>
      {markers.map((marker) => (
        <CustomMarker
          key={`${marker.location.latitude}-${
            marker.location.longitude
          }-${Math.random().toString(36).substring(2, 15)}`}
          latitude={marker.location.latitude}
          longitude={marker.location.longitude}
          iconType={marker.iconType}
        />
      ))}
    </div>
  );
}
