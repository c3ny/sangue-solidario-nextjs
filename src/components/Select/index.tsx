import { SelectHTMLAttributes } from "react";
import styles from "./styles.module.scss";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Label text for the select
   */
  label?: string;
  /**
   * Options to display in the select
   */
  options: SelectOption[];
  /**
   * Placeholder option text
   */
  placeholder?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Custom className for the container
   */
  containerClassName?: string;
  /**
   * Show required indicator (*)
   */
  showRequired?: boolean;
}

/**
 * Select Component
 * A reusable select/dropdown component with label and error handling
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "A+", label: "A+" },
 *   { value: "A-", label: "A-" },
 * ];
 *
 * <Select
 *   label="Tipo sanguíneo"
 *   options={options}
 *   placeholder="Selecione seu tipo sanguíneo"
 *   required
 * />
 * ```
 */
export const Select = ({
  label,
  options,
  placeholder,
  error,
  containerClassName,
  showRequired,
  className,
  ...props
}: ISelectProps) => {
  return (
    <div className={`${styles.formGroup} ${containerClassName || ""}`}>
      {label && (
        <label htmlFor={props.id} className={styles.label}>
          {label}
          {showRequired && <span className={styles.required}> *</span>}
        </label>
      )}
      <select
        className={`${styles.select} ${error ? styles.selectError : ""} ${
          className || ""
        }`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

