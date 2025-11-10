"use client";

import { useState, useMemo } from "react";
import { BsCalendar3, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { IAppointment } from "../../services/dashboard.service";
import styles from "./styles.module.scss";

interface IAppointmentCalendarProps {
  appointments: IAppointment[];
  onAppointmentClick?: (appointment: IAppointment) => void;
}

/**
 * Simple calendar component to display appointments
 */
export const AppointmentCalendar = ({
  appointments,
  onAppointmentClick,
}: IAppointmentCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, IAppointment[]> = {};

    appointments.forEach((appointment) => {
      if (appointment.appointmentDate) {
        const dateKey = appointment.appointmentDate;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(appointment);
      }
    });

    return grouped;
  }, [appointments]);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDateKey = (day: number): string => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString("pt-BR");
  };

  const getAppointmentsForDay = (day: number): IAppointment[] => {
    const dateKey = getDateKey(day);
    return appointmentsByDate[dateKey] || [];
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAppointments = getAppointmentsForDay(day);
      const dateKey = getDateKey(day);
      const isToday = new Date().toLocaleDateString("pt-BR") === dateKey;

      days.push(
        <div
          key={day}
          className={`${styles.calendarDay} ${
            isToday ? styles.calendarDayToday : ""
          } ${
            dayAppointments.length > 0 ? styles.calendarDayHasAppointments : ""
          }`}
          onClick={() => {
            if (dayAppointments.length > 0 && onAppointmentClick) {
              onAppointmentClick(dayAppointments[0]);
            }
          }}
        >
          <span className={styles.dayNumber}>{day}</span>
          {dayAppointments.length > 0 && (
            <div className={styles.appointmentsIndicator}>
              <span className={styles.appointmentsCount}>
                {dayAppointments.length}
              </span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button
          type="button"
          onClick={goToPreviousMonth}
          className={styles.navButton}
          aria-label="Mês anterior"
        >
          <BsChevronLeft />
        </button>
        <div className={styles.monthYear}>
          <BsCalendar3 className={styles.calendarIcon} />
          <h3>
            {monthNames[month]} {year}
          </h3>
        </div>
        <button
          type="button"
          onClick={goToNextMonth}
          className={styles.navButton}
          aria-label="Próximo mês"
        >
          <BsChevronRight />
        </button>
      </div>

      <button type="button" onClick={goToToday} className={styles.todayButton}>
        Hoje
      </button>

      <div className={styles.calendarGrid}>
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDayHeader}>
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {renderCalendarDays()}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendToday}`} />
          <span>Hoje</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={`${styles.legendColor} ${styles.legendHasAppointments}`}
          />
          <span>Com agendamentos</span>
        </div>
      </div>
    </div>
  );
};
