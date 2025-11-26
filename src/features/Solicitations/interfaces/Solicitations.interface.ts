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
  content: string;
  image?: string;
  location?: Location;
  startDate: string;
  finishDate: string;
  user: User;
}

export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}
