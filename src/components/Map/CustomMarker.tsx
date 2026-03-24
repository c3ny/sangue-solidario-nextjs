import { useEffect, useRef } from "react";
import mapboxgl, { MarkerOptions } from "mapbox-gl";
import { useMap } from "@/contexts/Map/MapContext";
import { CustomMarkerIconType } from "@/features/Home/components/Map/Marker";
import styles from "./styles.module.scss";

export interface ICustomMarkerProps extends MarkerOptions {
  latitude: number;
  longitude: number;
  tooltip?: string | React.FunctionComponent;
  iconType?: CustomMarkerIconType;
  onClick?: () => void;
}

export default function CustomMarker({
  latitude,
  longitude,
  tooltip,
  iconType = CustomMarkerIconType.DEFAULT,
  onClick,
}: ICustomMarkerProps) {
  const { map } = useMap();
  const markerRef = useRef<HTMLDivElement>(null);
  const markerInstanceRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    const markerEl = markerRef.current;

    if (!markerEl || !map) return;

    const iconUrlByType = {
      [CustomMarkerIconType.PERSON]: "/assets/images/icons/pin-paciente.svg",
      [CustomMarkerIconType.HANDLER]: "/assets/images/icons/pin-hospital.svg",
      [CustomMarkerIconType.DEFAULT]: "/assets/images/icons/pin-user.svg",
    };

    const iconUrl = iconUrlByType[iconType];

    markerEl.className = styles.customMarker;
    markerEl.style.width = "60px";
    markerEl.style.height = "60px";
    markerEl.style.cursor = "pointer";
    markerEl.style.backgroundImage = `url(${iconUrl})`;
    markerEl.style.backgroundSize = "contain";
    markerEl.style.backgroundRepeat = "no-repeat";

    const handleClick = () => {
      onClick?.();
    };

    markerEl.addEventListener("click", handleClick);

    const marker = new mapboxgl.Marker({ element: markerEl }).setLngLat([
      longitude,
      latitude,
    ]);

    if (tooltip) {
      const popup = new mapboxgl.Popup({ offset: 25, maxWidth: "280px" });
      if (typeof tooltip === "string") {
        popup.setHTML(tooltip);
      }
      marker.setPopup(popup);
    }

    marker.addTo(map);
    markerInstanceRef.current = marker;

    return () => {
      markerInstanceRef.current?.remove();
      markerEl.removeEventListener("click", handleClick);
    };
  }, [latitude, longitude, map, iconType, tooltip]);

  return (
    <div>
      <div ref={markerRef} />
    </div>
  );
}