import { Location } from "@/features/Solicitations/interfaces/Solicitations.interface";

export interface MapLocation {
  location: Location;
  onClick: () => void;
}
