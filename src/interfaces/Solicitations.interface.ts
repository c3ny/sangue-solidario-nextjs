export interface Solicitation {
  name: string;
  bloodType: string;
  image: string;
  location: Location;
}

export interface Location {
  lat: number;
  lng: number;
}
