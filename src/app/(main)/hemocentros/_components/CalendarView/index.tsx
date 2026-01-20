"use client";

import { useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import {
  IAppointment,
  AppointmentStatus,
} from "@/features/Institution/interfaces/Appointment.interface";
import styles from "./styles.module.scss";

export interface ICalendarViewProps {
  appointments: IAppointment[];
}

export const CalendarView = ({ appointments }: ICalendarViewProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(today.setDate(diff));
  });

  // Generate hours from 6 AM to 8 PM
  const hours = Array.from({ length: 15 }, (_, i) => i + 6);

  // Generate the 7 days of the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    setCurrentWeekStart(new Date(today.setDate(diff)));
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getAppointmentsForDateAndHour = (
    date: Date,
    hour: number
  ): IAppointment[] => {
    const dateStr = formatDate(date);
    return appointments.filter((appointment) => {
      if (appointment.scheduledDate !== dateStr) return false;
      const appointmentHour = parseInt(
        appointment.scheduledTime.split(":")[0],
        10
      );
      return appointmentHour === hour;
    });
  };

  const getStatusClass = (status: AppointmentStatus): string => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return styles.appointmentConfirmed;
      case AppointmentStatus.PENDING:
        return styles.appointmentPending;
      case AppointmentStatus.COMPLETED:
        return styles.appointmentCompleted;
      case AppointmentStatus.CANCELLED:
        return styles.appointmentCancelled;
      default:
        return "";
    }
  };

  const getMonthYearDisplay = (): string => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(currentWeekStart.getDate() + 6);

    if (currentWeekStart.getMonth() === endDate.getMonth()) {
      return currentWeekStart.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      });
    } else {
      return `${currentWeekStart.toLocaleDateString("pt-BR", {
        month: "short",
      })} - ${endDate.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      })}`;
    }
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Calendar Header */}
      <div className={styles.calendarHeader}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            onClick={goToToday}
            className={styles.todayButton}
          >
            Hoje
          </button>
          <div className={styles.navigationButtons}>
            <button
              type="button"
              onClick={goToPreviousWeek}
              className={styles.navButton}
              aria-label="Semana anterior"
            >
              <BsChevronLeft />
            </button>
            <button
              type="button"
              onClick={goToNextWeek}
              className={styles.navButton}
              aria-label="Próxima semana"
            >
              <BsChevronRight />
            </button>
          </div>
          <h3 className={styles.monthYear}>{getMonthYearDisplay()}</h3>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendarGrid}>
        {/* Time Column */}
        <div className={styles.timeColumn}>
          <div className={styles.timeHeader}></div>
          {hours.map((hour) => (
            <div key={hour} className={styles.timeSlot}>
              <span className={styles.timeLabel}>
                {hour.toString().padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* Days Columns */}
        {weekDays.map((date, dayIndex) => (
          <div key={dayIndex} className={styles.dayColumn}>
            {/* Day Header */}
            <div
              className={`${styles.dayHeader} ${
                isToday(date) ? styles.today : ""
              }`}
            >
              <div className={styles.dayName}>
                {date.toLocaleDateString("pt-BR", { weekday: "short" })}
              </div>
              <div
                className={`${styles.dayNumber} ${
                  isToday(date) ? styles.todayNumber : ""
                }`}
              >
                {date.getDate()}
              </div>
            </div>

            {/* Hour Slots */}
            {hours.map((hour) => {
              const appointmentsInSlot = getAppointmentsForDateAndHour(
                date,
                hour
              );
              return (
                <div key={hour} className={styles.hourSlot}>
                  {appointmentsInSlot.length > 0 ? (
                    <div className={styles.appointmentsContainer}>
                      {appointmentsInSlot.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`${
                            styles.appointmentBlock
                          } ${getStatusClass(appointment.status)}`}
                          title={`${appointment.donorName} - ${appointment.scheduledTime}`}
                        >
                          <div className={styles.appointmentTime}>
                            {appointment.scheduledTime}
                          </div>
                          <div className={styles.appointmentName}>
                            {appointment.donorName}
                          </div>
                          <div className={styles.appointmentBloodType}>
                            {appointment.bloodType}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendTitle}>Legenda:</div>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <div
              className={`${styles.legendColor} ${styles.legendConfirmed}`}
            ></div>
            <span>Confirmado</span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={`${styles.legendColor} ${styles.legendPending}`}
            ></div>
            <span>Pendente</span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={`${styles.legendColor} ${styles.legendCompleted}`}
            ></div>
            <span>Concluído</span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={`${styles.legendColor} ${styles.legendCancelled}`}
            ></div>
            <span>Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
