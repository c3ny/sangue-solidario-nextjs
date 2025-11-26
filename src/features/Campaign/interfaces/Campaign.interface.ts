export interface ICampaign {
  id: string;
  title: string;
  description: string;
  bannerImage?: string;
  startDate: string;
  endDate: string;
  bloodType?: string;
  location: ICampaignLocation;
  organizerId: string;
  organizerName: string;
  organizerUsername?: string;
  status: CampaignStatus;
  currentDonations: number;
  targetDonations?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICampaignLocation {
  name: string;
  address: string;
  city: string;
  uf: string;
  zipcode?: string;
  latitude: number;
  longitude: number;
}

export enum CampaignStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface ICampaignSchedule {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bloodType: string;
  birthDate: string;
  cpf: string;
  scheduledDate: string;
  scheduledTime: string;
  status: ScheduleStatus;
  notes?: string;
  createdAt: string;
}

export enum ScheduleStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface ICampaignScheduleFormData {
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  birthDate: string;
  cpf: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}
