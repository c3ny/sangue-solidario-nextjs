import { InputHTMLAttributes, useState } from "react";
import { IconType } from "react-icons";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import styles from "./styles.module.scss";

export interface IToggleInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onToggle"
  > {
  /**
   * Label text for the input
   */
  label?: string;
  /**
   * Icon component from react-icons
   */
  icon?: IconType;
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
  /**
   * The actual value to display (unmasked)
   */
  value: string;
  /**
   * Function to mask the value for display
   * @param value - The unmasked value
   * @returns The masked value
   */
  maskFn: (value: string) => string;
  /**
   * Callback when toggle state changes
   * @param isVisible - Whether the value is currently visible
   */
  onToggle?: (isVisible: boolean) => void;
  /**
   * Initial visibility state (default: false - masked)
   */
  defaultVisible?: boolean;
  /**
   * Custom aria label for toggle button
   */
  toggleAriaLabel?: {
    show: string;
    hide: string;
  };
}

/**
 * ToggleInput Component
 * Input component that can toggle between showing masked and unmasked values
 * Useful for sensitive data like emails, phone numbers, etc.
 *
 * @example
 * ```tsx
 * import { BsEnvelope } from "react-icons/bs";
 * import { maskEmail } from "@/utils/masks";
 *
 * <ToggleInput
 *   label="Email de login"
 *   icon={BsEnvelope}
 *   value="ysrael@gmail.com"
 *   maskFn={maskEmail}
 *   type="email"
 *   readOnly
 * />
 * ```
 */
export const ToggleInput = ({
  label,
  icon: Icon,
  error,
  containerClassName,
  showRequired,
  value,
  maskFn,
  onToggle,
  defaultVisible = false,
  toggleAriaLabel,
  className,
  ...props
}: IToggleInputProps) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const handleToggle = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    onToggle?.(newVisibility);
  };

  const displayValue = isVisible ? value : value ? maskFn(value) : "";

  const showLabel = toggleAriaLabel?.show || "Mostrar valor";
  const hideLabel = toggleAriaLabel?.hide || "Ocultar valor";

  return (
    <div className={`${styles.formGroup} ${containerClassName || ""}`}>
      {label && (
        <label htmlFor={props.id} className={styles.label}>
          {label}
          {showRequired && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {Icon && <Icon className={styles.inputIcon} />}
        <input
          type={props.type || "text"}
          className={`${styles.input} ${Icon ? styles.inputWithIcon : ""} ${
            styles.inputWithToggle
          } ${error ? styles.inputError : ""} ${className || ""}`}
          value={displayValue}
          readOnly
          {...props}
        />
        {value && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={handleToggle}
            aria-label={isVisible ? hideLabel : showLabel}
            title={isVisible ? hideLabel : showLabel}
          >
            {isVisible ? <BsEyeSlash /> : <BsEye />}
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
