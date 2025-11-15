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
}

export default function CustomMarker({
  latitude,
  longitude,
  tooltip,
  iconType = CustomMarkerIconType.DEFAULT,
}: ICustomMarkerProps) {
  const { map } = useMap();
  const markerRef = useRef<HTMLDivElement>(null);
  let marker: mapboxgl.Marker | null = null;

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

    markerEl.addEventListener("click", () => {
      console.log("click");
    });

    const options = {
      element: markerEl,
    };

    marker = new mapboxgl.Marker(options)
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerEl.addEventListener("click", () => {
      console.log("click");
    });

    if (tooltip) {
      const popup = new mapboxgl.Popup({ offset: 25 });
      if (typeof tooltip === "string") {
        popup.setHTML(`<p>${tooltip}</p>`);
      } else {
        popup.setHTML(`<p>${String(tooltip)}</p>`);
      }
    }

    return () => {
      if (marker) {
        marker.remove();

        markerEl.removeEventListener("click", () => {
          console.log("click");
        });
      }
    };
  }, [latitude, longitude, map]);

  return (
    <div>
      <div ref={markerRef} />
    </div>
  );
}
