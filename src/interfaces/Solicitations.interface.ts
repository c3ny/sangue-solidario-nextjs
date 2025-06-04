export interface Solicitation {
  name: string;
  id: number;
  bloodType: string;
  quantity: number;
  image: string;
  location: Location;
}

export interface Location {
  lat: number;
  lng: number;
}
