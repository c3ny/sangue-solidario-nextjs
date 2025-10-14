"use client";

import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Corrige os ícones padrão do Leaflet (necessário no Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export interface CustomMarkerProps {
  lat: number;
  lng: number;
  label?: string;
  popupContent?: string;
  onClick?: () => void;
  iconUrl?: string; // opcional — para usar ícone customizado
}

export default function CustomMarker({
  lat,
  lng,
  label,
  popupContent,
  onClick,
  iconUrl,
}: CustomMarkerProps) {
  // Se quiser usar ícone personalizado:
  const customIcon = iconUrl
    ? L.icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })
    : undefined;

  return (
    <Marker
      position={[lat, lng]}
      eventHandlers={{
        click: () => {
          if (onClick) onClick();
        },
      }}
    >
      {label && <Tooltip>{label}</Tooltip>}
    </Marker>
  );
}
