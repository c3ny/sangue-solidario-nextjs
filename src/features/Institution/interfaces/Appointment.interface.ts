export interface IAppointment {
  id: string;
  institutionId: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  bloodType: string;
  birthDate: string;
  cpf: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface ITimeSlot {
  time: string;
  available: boolean;
  label: string;
}

export interface IAvailableDate {
  date: string;
  availableSlots: number;
  dayOfWeek: string;
}

export interface IScheduleConfig {
  operatingDays: number[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  maxAppointmentsPerSlot: number;
  daysAheadAvailable: number;
}
