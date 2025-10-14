"use client";

import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";

export enum CustomMarkerIconType {
  DEFAULT = "default",
  PERSON = "person",
  HANDLER = "handler",
}

export interface CustomMarkerProps {
  lat: number;
  lng: number;
  label?: string | React.FunctionComponent;
  onClick?: () => void;
  iconType?: CustomMarkerIconType;
  iconUrl?: string; // opcional — para usar ícone customizado
}

export default function CustomMarker({
  lat,
  lng,
  label: Label,
  onClick,
  iconType = CustomMarkerIconType.DEFAULT,
}: CustomMarkerProps) {
  const iconUrl = useMemo(() => {
    const urlByType = {
      [CustomMarkerIconType.PERSON]: "/assets/images/icons/pin-paciente.svg",
      [CustomMarkerIconType.HANDLER]: "/assets/images/icons/pin-hospital.svg",
      [CustomMarkerIconType.DEFAULT]: "/assets/images/icons/pin-user.svg",
    };

    return urlByType[iconType ?? CustomMarkerIconType.DEFAULT];
  }, [iconType]);
  console.log(iconUrl);

  return (
    <Marker
      position={[lat, lng]}
      icon={
        iconUrl
          ? L.icon({
              iconUrl,
              iconSize: [60, 60],
              iconAnchor: [15, 60],
              popupAnchor: [10, 15],
              tooltipAnchor: [5, -30],
            })
          : undefined
      }
      eventHandlers={{
        click: () => {
          if (onClick) onClick();
        },
      }}
    >
      {typeof Label === "function" ? (
        <Label />
      ) : (
        Label && <Tooltip>{Label}</Tooltip>
      )}
    </Marker>
  );
}
