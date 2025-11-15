import { createContext, useContext } from "react";
import { Map } from "mapbox-gl";

interface MapContextType {
  map: Map | null;
}

export const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);

  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }

  return context;
};
