import { useEffect, useRef, useState } from "react";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface IUseGeolocation {
  realtime?: boolean;
  options?: PositionOptions;
}

const FALLBACK_POSITION: Coordinates = {
  latitude: -23.5505,
  longitude: -46.6333,
};

const getPositionByIP = async (): Promise<Coordinates> => {
  try {
    const res = await fetch("/api/geolocation");
    const data = await res.json();
    if (data.latitude && data.longitude) {
      return { latitude: data.latitude, longitude: data.longitude };
    }
  } catch {
    console.warn("IP geolocation failed, using default fallback.");
  }
  return FALLBACK_POSITION;
};

export const useGeolocation = (parameters?: IUseGeolocation) => {
  const { options = {}, realtime = false } = parameters ?? {};

  const optionsRef = useRef<PositionOptions>({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    ...options,
  });

  const [currentPosition, setCurrentPosition] = useState<Coordinates | null>(
    null
  );

  useEffect(() => {
    if (!window.navigator || !window.navigator.geolocation) {
      console.warn("Geolocation not supported. Falling back to IP.");
      getPositionByIP().then(setCurrentPosition);
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setCurrentPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const onError = async (error: GeolocationPositionError) => {
      console.warn(`Geolocation error (${error.code}): ${error.message}. Falling back to IP.`);
      const position = await getPositionByIP();
      setCurrentPosition(position);
    };

    if (realtime) {
      const watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        optionsRef.current
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      optionsRef.current
    );
  }, [realtime]);

  return { currentPosition };
};