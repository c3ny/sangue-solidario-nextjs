export enum UserType {
  HANDLER = "handler",
  USER = "user",
}
export interface User {
  type: UserType;
}
export interface Solicitation {
  name: string;
  id: number;
  bloodType: string;
  quantity: number;
  image?: string;
  location?: Location;
  user: User;
}

export interface Location {
  latitude: number;
  longitude: number;
}
