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

  const [currentPosition, setCurrentPosition] = useState<Coordinates>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (!window.navigator || !window.navigator.geolocation) {
      return;
    }

    if (realtime) {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition(position.coords);
        },
        (positionError) => {
          throw new Error(positionError.message);
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
