export interface IAppointment {
  id: string;
  /** Alias de companyId mantido por compat com componentes legados. */
  institutionId: string;
  /** Campos populados pelo appointments-service-node (opcionais no mock legado). */
  companyId?: string;
  campaignId?: string;
  donorUserId?: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  bloodType: string;
  /** Campos legados (não retornados pelo appointments-service-node) */
  birthDate?: string;
  cpf?: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string | null;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string | null;
  confirmedAt?: string | null;
  completedAt?: string | null;
}

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
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
