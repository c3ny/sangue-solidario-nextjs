"use client";

import GoogleMaps from "@/components/Map";
import { Location } from "@/interfaces/Solicitations.interface";
import { useMemo } from "react";

export interface IViewSolicitationMapSectionProps {
  location: Location;
}

export default function ViewSolicitationMapSection({
  location,
}: IViewSolicitationMapSectionProps) {
  const markers: { location: Location }[] = useMemo(() => {
    return [{ location: location }];
  }, []);

  return <GoogleMaps markers={markers} />;
}
