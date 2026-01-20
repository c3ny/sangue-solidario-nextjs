import { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { IAvailableDate } from "@/features/Institution/interfaces/Appointment.interface";
import styles from "./styles.module.scss";

export interface IDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  onBlur?: () => void;
  availableDates: IAvailableDate[];
  hasError?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const DatePicker = ({
  value,
  onChange,
  onBlur,
  availableDates,
  hasError = false,
  disabled = false,
  id = "datePicker",
  name = "date",
}: IDatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (availableDates.length > 0) {
      return new Date(availableDates[0].date + "T00:00:00");
    }
    const today = new Date();
    today.setDate(1);
    return today;
  });

  useEffect(() => {
    if (availableDates.length > 0 && !value) {
      const firstDate = new Date(availableDates[0].date + "T00:00:00");
      firstDate.setDate(1);
      setCurrentMonth(firstDate);
    }
  }, [availableDates, value]);

  const handleDateClick = (date: string) => {
    if (!disabled) {
      onChange(date);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const formatDateDisplay = (
    dateString: string
  ): { day: string; month: string; weekday: string } => {
    const date = new Date(dateString + "T00:00:00");
    return {
      day: date.getDate().toString(),
      month: date.toLocaleDateString("pt-BR", { month: "short" }),
      weekday: date.toLocaleDateString("pt-BR", { weekday: "short" }),
    };
  };

  const datesInCurrentMonth = availableDates.filter((dateInfo) => {
    const date = new Date(dateInfo.date + "T00:00:00");
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  });

  const hasPreviousMonth = availableDates.some((dateInfo) => {
    const date = new Date(dateInfo.date + "T00:00:00");
    const compareDate = new Date(currentMonth);
    compareDate.setMonth(currentMonth.getMonth() - 1);
    return (
      date.getMonth() === compareDate.getMonth() &&
      date.getFullYear() === compareDate.getFullYear()
    );
  });

  const hasNextMonth = availableDates.some((dateInfo) => {
    const date = new Date(dateInfo.date + "T00:00:00");
    const compareDate = new Date(currentMonth);
    compareDate.setMonth(currentMonth.getMonth() + 1);

    return (
      date.getMonth() === compareDate.getMonth() &&
      date.getFullYear() === compareDate.getFullYear()
    );
  });

  const monthName = currentMonth.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.datePicker}>
      <input type="hidden" id={id} name={name} value={value} onBlur={onBlur} />

      {availableDates.length === 0 ? (
        <div className={styles.noAvailability}>
          <p>Nenhuma data disponível no momento</p>
          <span>Entre em contato com a instituição para mais informações</span>
        </div>
      ) : (
        <>
          <div className={styles.monthNavigation}>
            <button
              type="button"
              className={styles.navButton}
              onClick={goToPreviousMonth}
              disabled={disabled || !hasPreviousMonth}
              title="Mês anterior"
            >
              <BsChevronLeft />
            </button>

            <h3 className={styles.monthTitle}>
              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </h3>

            <button
              type="button"
              className={styles.navButton}
              onClick={goToNextMonth}
              disabled={disabled || !hasNextMonth}
              title="Próximo mês"
            >
              <BsChevronRight />
            </button>
          </div>

          {datesInCurrentMonth.length === 0 ? (
            <div className={styles.noAvailabilityMonth}>
              <p>Nenhuma data disponível neste mês</p>
              <span>
                {hasNextMonth
                  ? "Navegue para o próximo mês para ver datas disponíveis"
                  : "Não há datas disponíveis"}
              </span>
            </div>
          ) : (
            <div className={styles.dateGrid}>
              {datesInCurrentMonth.map((dateInfo) => {
                const { day, month, weekday } = formatDateDisplay(
                  dateInfo.date
                );
                const isSelected = value === dateInfo.date;

                return (
                  <button
                    key={dateInfo.date}
                    type="button"
                    className={`${styles.dateCard} ${
                      isSelected ? styles.selected : ""
                    } ${hasError && !value ? styles.error : ""}`}
                    onClick={() => handleDateClick(dateInfo.date)}
                    disabled={disabled}
                    title={`${dateInfo.dayOfWeek} - ${dateInfo.availableSlots} horários disponíveis`}
                  >
                    <span className={styles.weekday}>{weekday}</span>
                    <span className={styles.day}>{day}</span>
                    <span className={styles.month}>{month}</span>
                    <span className={styles.availableSlots}>
                      {dateInfo.availableSlots}{" "}
                      {dateInfo.availableSlots === 1 ? "vaga" : "vagas"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
