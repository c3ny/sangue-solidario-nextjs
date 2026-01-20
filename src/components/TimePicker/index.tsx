import { ITimeSlot } from "@/features/Institution/interfaces/Appointment.interface";
import styles from "./styles.module.scss";

export interface ITimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onBlur?: () => void;
  timeSlots: ITimeSlot[];
  hasError?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const TimePicker = ({
  value,
  onChange,
  onBlur,
  timeSlots,
  hasError = false,
  disabled = false,
  id = "timePicker",
  name = "time",
}: ITimePickerProps) => {
  const handleTimeClick = (time: string, available: boolean) => {
    if (!disabled && available) {
      onChange(time);
    }
  };

  const availableSlots = timeSlots.filter((slot) => slot.available);

  return (
    <div className={styles.timePicker}>
      <input type="hidden" id={id} name={name} value={value} onBlur={onBlur} />

      {timeSlots.length === 0 ? (
        <div className={styles.noSlots}>
          <p>Selecione uma data primeiro</p>
          <span>Os horários disponíveis serão exibidos aqui</span>
        </div>
      ) : availableSlots.length === 0 ? (
        <div className={styles.noAvailability}>
          <p>Nenhum horário disponível para esta data</p>
          <span>Por favor, selecione outra data</span>
        </div>
      ) : (
        <div className={styles.timeGrid}>
          {timeSlots.map((slot) => {
            const isSelected = value === slot.time;
            const isAvailable = slot.available;

            return (
              <button
                key={slot.time}
                type="button"
                className={`${styles.timeCard} ${
                  isSelected ? styles.selected : ""
                } ${!isAvailable ? styles.unavailable : ""} ${
                  hasError && !value ? styles.error : ""
                }`}
                onClick={() => handleTimeClick(slot.time, isAvailable)}
                disabled={disabled || !isAvailable}
                title={
                  isAvailable ? `Horário disponível` : `Horário indisponível`
                }
              >
                <span className={styles.timeLabel}>{slot.label}</span>
                {!isAvailable && (
                  <span className={styles.unavailableLabel}>Indisponível</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
