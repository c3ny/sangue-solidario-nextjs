import { InputHTMLAttributes, useState, ChangeEvent } from "react";
import { IconType } from "react-icons";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import styles from "./styles.module.scss";

export interface IMaskedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
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
   * Show password toggle button (only for type="password")
   */
  showPasswordToggle?: boolean;
  /**
   * Mask function to apply to the input value
   */
  maskFn?: (value: string) => string;
  /**
   * Unmask function to get raw value
   */
  unmaskFn?: (value: string) => string;
  /**
   * onChange handler that receives both masked and unmasked values
   */
  onChange?: (
    event: ChangeEvent<HTMLInputElement>,
    unmaskedValue: string
  ) => void;
}

/**
 * Masked Input Component
 * Input component with support for custom masking functions
 *
 * @example
 * ```tsx
 * import { maskCPF, unmaskCPF } from "@/utils/masks";
 *
 * <MaskedInput
 *   label="CPF"
 *   name="cpf"
 *   maskFn={maskCPF}
 *   unmaskFn={unmaskCPF}
 *   placeholder="000.000.000-00"
 * />
 * ```
 */
export const MaskedInput = ({
  label,
  icon: Icon,
  error,
  containerClassName,
  showRequired,
  showPasswordToggle,
  maskFn,
  unmaskFn,
  onChange,
  className,
  type,
  value: controlledValue,
  ...props
}: IMaskedInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState("");

  const displayValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  const isPasswordField = type === "password" && showPasswordToggle;
  const inputType = isPasswordField && showPassword ? "text" : type;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Apply mask if provided
    if (maskFn) {
      newValue = maskFn(newValue);
    }

    // Update internal state if not controlled
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    // Get unmasked value
    const unmaskedValue = unmaskFn ? unmaskFn(newValue) : newValue;

    // Update the input value for form submission
    e.target.value = unmaskedValue;

    // Call onChange with both masked display value and unmasked form value
    if (onChange) {
      onChange(e, unmaskedValue);
    }
  };

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
          type={inputType}
          className={`${styles.input} ${Icon ? styles.inputWithIcon : ""} ${
            isPasswordField ? styles.inputWithToggle : ""
          } ${error ? styles.inputError : ""} ${className || ""}`}
          value={
            maskFn && displayValue ? maskFn(String(displayValue)) : displayValue
          }
          onChange={handleChange}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
