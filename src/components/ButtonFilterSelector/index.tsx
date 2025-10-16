"use client";

import { ReactNode } from "react";
import { Button } from "@/components/Button";
import styles from "./styles.module.scss";

export interface IFilterOption<T = string> {
  /**
   * Unique value for the filter option
   */
  value: T;
  /**
   * Display label for the filter option
   */
  label: string;
  /**
   * Optional icon to display with the label
   */
  icon?: ReactNode;
}

export interface IButtonFilterSelectorProps<T = string> {
  /**
   * Array of filter options to display
   */
  options: IFilterOption<T>[];
  /**
   * Currently selected value
   */
  value: T;
  /**
   * Callback when a filter is selected
   */
  onChange: (value: T) => void;
  /**
   * Optional "All" option configuration
   */
  allOption?: {
    value: T;
    label?: string;
  };
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Size variant
   * @default "medium"
   */
  size?: "small" | "medium" | "large";
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

/**
 * ButtonFilterSelector Component
 * Displays a group of filter buttons where only one can be selected at a time
 *
 * @example
 * ```tsx
 * <ButtonFilterSelector
 *   options={[
 *     { value: "A+", label: "A+" },
 *     { value: "B+", label: "B+" }
 *   ]}
 *   value={selectedBloodType}
 *   onChange={setSelectedBloodType}
 *   allOption={{ value: "all", label: "Todos" }}
 * />
 * ```
 */
export function ButtonFilterSelector<T = string>({
  options,
  value,
  onChange,
  allOption,
  className = "",
  size = "medium",
  ariaLabel = "Filtros",
}: IButtonFilterSelectorProps<T>) {
  return (
    <div
      className={`${styles.filterSelector} ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {allOption && (
        <Button
          type="button"
          variant="filter"
          size={size}
          isActive={value === allOption.value}
          onClick={() => onChange(allOption.value)}
          aria-pressed={value === allOption.value}
        >
          {allOption.label || "Todos"}
        </Button>
      )}

      {options.map((option) => (
        <Button
          key={String(option.value)}
          type="button"
          variant="filter"
          size={size}
          isActive={value === option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          iconBefore={option.icon}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
