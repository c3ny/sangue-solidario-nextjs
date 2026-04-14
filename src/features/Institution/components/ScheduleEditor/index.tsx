"use client";

import styles from "./styles.module.scss";

export interface ScheduleItem {
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

const DAY_LABELS: Record<ScheduleItem["dayOfWeek"], string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { dayOfWeek: "MONDAY", openTime: "08:00", closeTime: "17:00", isOpen: true },
  { dayOfWeek: "TUESDAY", openTime: "08:00", closeTime: "17:00", isOpen: true },
  { dayOfWeek: "WEDNESDAY", openTime: "08:00", closeTime: "17:00", isOpen: true },
  { dayOfWeek: "THURSDAY", openTime: "08:00", closeTime: "17:00", isOpen: true },
  { dayOfWeek: "FRIDAY", openTime: "08:00", closeTime: "17:00", isOpen: true },
  { dayOfWeek: "SATURDAY", openTime: "08:00", closeTime: "12:00", isOpen: false },
  { dayOfWeek: "SUNDAY", openTime: "00:00", closeTime: "00:00", isOpen: false },
];

interface ScheduleEditorProps {
  value: ScheduleItem[];
  onChange: (schedule: ScheduleItem[]) => void;
}

export function ScheduleEditor({ value, onChange }: ScheduleEditorProps) {
  const updateItem = (
    index: number,
    field: keyof ScheduleItem,
    newValue: string | boolean
  ) => {
    const updated = value.map((item, i) =>
      i === index ? { ...item, [field]: newValue } : item
    );
    onChange(updated);
  };

  return (
    <div className={styles.wrapper}>
      {value.map((item, index) => (
        <div key={item.dayOfWeek} className={styles.row}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={item.isOpen}
              onChange={(e) => updateItem(index, "isOpen", e.target.checked)}
              className={styles.checkbox}
            />
            <span className={`${styles.slider} ${item.isOpen ? styles.sliderOn : ""}`} />
          </label>

          <span className={`${styles.dayLabel} ${!item.isOpen ? styles.dayLabelClosed : ""}`}>
            {DAY_LABELS[item.dayOfWeek]}
          </span>

          {item.isOpen ? (
            <div className={styles.timeInputs}>
              <input
                type="time"
                value={item.openTime}
                onChange={(e) => updateItem(index, "openTime", e.target.value)}
                className={styles.timeInput}
                aria-label={`Abertura ${DAY_LABELS[item.dayOfWeek]}`}
              />
              <span className={styles.timeSeparator}>até</span>
              <input
                type="time"
                value={item.closeTime}
                onChange={(e) => updateItem(index, "closeTime", e.target.value)}
                className={styles.timeInput}
                aria-label={`Fechamento ${DAY_LABELS[item.dayOfWeek]}`}
              />
            </div>
          ) : (
            <span className={styles.closedLabel}>Fechado</span>
          )}
        </div>
      ))}
    </div>
  );
}
