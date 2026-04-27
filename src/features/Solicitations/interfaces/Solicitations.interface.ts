export enum UserType {
  HANDLER = "handler",
  USER = "user",
}
export enum SolicitationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}
export interface User {
  type: UserType;
}
export interface Solicitation {
  name: string;
  id: string;
  bloodType: string;
  quantity: number;
  content: string;
  image?: string;
  location?: Location;
  startDate: string;
  finishDate: string;
  status?: SolicitationStatus;
  userId?: string;
  description?: string;
  phone?: string;
  user?: User;
}

export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}
