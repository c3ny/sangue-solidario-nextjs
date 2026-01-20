import {
  IAppointment,
  ITimeSlot,
  IAvailableDate,
  IScheduleConfig,
} from "@/features/Institution/interfaces/Appointment.interface";

export class SchedulingService {
  static generateTimeSlots(
    config: IScheduleConfig,
    selectedDate: string,
    existingAppointments: IAppointment[]
  ): ITimeSlot[] {
    const slots: ITimeSlot[] = [];
    const [startHour, startMin] = config.startTime.split(":").map(Number);
    const [endHour, endMin] = config.endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    for (
      let minutes = startMinutes;
      minutes < endMinutes;
      minutes += config.slotDuration
    ) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const time = `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;

      const appointmentsAtSlot = existingAppointments.filter(
        (apt) =>
          apt.scheduledDate === selectedDate &&
          apt.scheduledTime === time &&
          apt.status !== "CANCELLED"
      );

      const available =
        appointmentsAtSlot.length < config.maxAppointmentsPerSlot;

      slots.push({
        time,
        available,
        label: this.formatTimeLabel(time),
      });
    }

    return slots;
  }

  static getAvailableDates(
    config: IScheduleConfig,
    existingAppointments: IAppointment[]
  ): IAvailableDate[] {
    const dates: IAvailableDate[] = [];

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= config.daysAheadAvailable; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOfWeek = date.getDay();

      if (!config.operatingDays.includes(dayOfWeek)) {
        continue;
      }

      const dateString = this.formatDate(date);
      const slots = this.generateTimeSlots(
        config,
        dateString,
        existingAppointments
      );
      const availableSlots = slots.filter((slot) => slot.available).length;

      if (availableSlots > 0) {
        dates.push({
          date: dateString,
          availableSlots,
          dayOfWeek: this.getDayName(dayOfWeek),
        });
      }
    }

    return dates;
  }

  static isSlotAvailable(
    date: string,
    time: string,
    config: IScheduleConfig,
    existingAppointments: IAppointment[]
  ): boolean {
    const appointmentsAtSlot = existingAppointments.filter(
      (apt) =>
        apt.scheduledDate === date &&
        apt.scheduledTime === time &&
        apt.status !== "CANCELLED"
    );

    return appointmentsAtSlot.length < config.maxAppointmentsPerSlot;
  }

  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  static formatTimeLabel(time: string): string {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  }

  static getDayName(dayOfWeek: number): string {
    const days = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    return days[dayOfWeek];
  }

  static formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  static getDefaultConfig(): IScheduleConfig {
    return {
      operatingDays: [1, 2, 3, 4, 5],
      startTime: "08:00",
      endTime: "17:00",
      slotDuration: 30,
      maxAppointmentsPerSlot: 2,
      daysAheadAvailable: 90,
    };
  }
}
