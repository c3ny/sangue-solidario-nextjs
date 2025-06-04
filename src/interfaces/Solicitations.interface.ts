export interface Solicitation {
  name: string;
  id: number;
  bloodType: string;
  image: string;
  location: Location;
}

export interface Location {
  lat: number;
  lng: number;
}
