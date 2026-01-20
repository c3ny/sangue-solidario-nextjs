/**
 * Institution Profile Interface
 * Defines the structure for hospital and blood center profiles
 */

export enum InstitutionType {
  HOSPITAL = "HOSPITAL",
  BLOOD_CENTER = "BLOOD_CENTER",
  CLINIC = "CLINIC",
}

export enum InstitutionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export interface IInstitutionLocation {
  address: string;
  city: string;
  uf: string;
  zipcode?: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  complement?: string;
}

export interface IInstitutionContact {
  phone: string;
  email: string;
  website?: string;
  whatsapp?: string;
}

export interface IInstitutionSchedule {
  dayOfWeek: string; // "monday", "tuesday", etc.
  openTime: string; // "08:00"
  closeTime: string; // "18:00"
  isOpen: boolean;
}

export interface IInstitutionBloodStock {
  bloodType: string; // A+, A-, B+, B-, AB+, AB-, O+, O-
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  status: "CRITICAL" | "LOW" | "NORMAL" | "GOOD";
  lastUpdate: string; // ISO 8601
}

export interface IInstitution {
  id: string;
  username: string; // Unique username for URL (@username)
  institutionName: string;
  cnpj: string;
  cnes?: string; // National Health Establishment Code
  type: InstitutionType;
  status: InstitutionStatus;
  description?: string;
  bannerImage?: string;
  logoImage?: string;
  location: IInstitutionLocation;
  contact: IInstitutionContact;
  schedule: IInstitutionSchedule[];
  bloodStock?: IInstitutionBloodStock[];
  acceptsDonations: boolean;
  acceptsScheduling: boolean;
  userId: string; // Reference to user who manages the institution
  createdAt: string;
  updatedAt: string;
}

export interface IInstitutionAppointment {
  id: string;
  institutionId: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  bloodType: string;
  scheduledDate: string; // ISO 8601
  scheduledTime: string; // "14:00"
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  NO_SHOW = "NO_SHOW",
}

export interface IAppointmentFormData {
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  bloodType: string;
  birthDate: string;
  cpf: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}

export interface IInstitutionStats {
  totalDonations: number;
  totalAppointments: number;
  activeAppointments: number;
  completedAppointments: number;
}
