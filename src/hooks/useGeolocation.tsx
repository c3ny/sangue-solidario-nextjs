import { useEffect, useState } from "react";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface IUseGeolocation {
  realtime?: boolean;
  options?: PositionOptions;
}

export const useGeolocation = (parameters?: IUseGeolocation) => {
  const { options = {}, realtime = false } = parameters ?? {};

  const [currentPosition, setCurrentPosition] = useState<Coordinates | null>(
    null
  );

  useEffect(() => {
    if (!window.navigator || !window.navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");

      setCurrentPosition({
        latitude: -23.471651468307545,
        longitude: -47.48199109453452,
      });

      return;
    }

    if (realtime) {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition(position.coords);
        },
        (positionError) => {
          console.error(positionError.message);
        },
        options
      );

      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition(position.coords);
    });
  }, []);

  return { currentPosition };
};
