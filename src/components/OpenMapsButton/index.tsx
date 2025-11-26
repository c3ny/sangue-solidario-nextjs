"use client";

import { Button, IButtonProps } from "@/components/Button";
import { BsGeoAlt } from "react-icons/bs";

interface IOpenMapsButtonProps extends Omit<IButtonProps, "onClick"> {
  address: string;
  latitude?: number;
  longitude?: number;
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent || window.navigator.vendor || "";
  return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
}

function isAndroid(): boolean {
  if (typeof window === "undefined") return false;
  return /android/i.test(window.navigator.userAgent);
}

export function OpenMapsButton({
  address,
  latitude,
  longitude,
  ...buttonProps
}: IOpenMapsButtonProps) {
  const handleOpenMaps = () => {
    if (!address?.trim() && (!latitude || !longitude)) {
      console.error("Address or coordinates are required to open maps");
      alert("Endereço ou coordenadas não disponíveis para abrir o mapa.");
      return;
    }

    const ios = isIOS();
    const android = isAndroid();
    let mapsUrl: string;

    if (ios) {
      if (latitude && longitude) {
        mapsUrl = `maps://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
      } else {
        mapsUrl = `maps://maps.apple.com/?q=${encodeURIComponent(address)}`;
      }
    } else if (android) {
      if (latitude && longitude) {
        mapsUrl = `google.navigation:q=${latitude},${longitude}`;
      } else {
        mapsUrl = `geo:0,0?q=${encodeURIComponent(address)}`;
      }
    } else {
      if (latitude && longitude) {
        mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      } else {
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          address
        )}`;
      }
    }

    try {
      if (ios || android) {
        window.location.href = mapsUrl;

        setTimeout(() => {
          const webUrl =
            latitude && longitude
              ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  address
                )}`;
          window.open(webUrl, "_blank");
        }, 1000);
      } else {
        window.open(mapsUrl, "_blank");
      }
    } catch (error) {
      console.error("Error opening maps:", error);
      const webUrl =
        latitude && longitude
          ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address
            )}`;
      window.open(webUrl, "_blank");
    }
  };

  return (
    <Button {...buttonProps} onClick={handleOpenMaps} iconAfter={<BsGeoAlt />}>
      Ver Rotas no Maps
    </Button>
  );
}
