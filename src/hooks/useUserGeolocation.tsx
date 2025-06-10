import { Location } from "@/interfaces/Solicitations.interface";
import { useEffect, useState } from "react";

export const useUserGeolocation = (): Location | null => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // update the value of userlocation variable
        setUserLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  return userLocation;
};
