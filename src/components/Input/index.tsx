import { InputHTMLAttributes, useState } from "react";
import { IconType } from "react-icons";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import styles from "./styles.module.scss";

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
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
}

/**
 * Input Component
 * A reusable input component with icon support, label, and error handling
 *
 * @example
 * ```tsx
 * import { BsEnvelope } from "react-icons/bs";
 *
 * <Input
 *   label="E-mail"
 *   icon={BsEnvelope}
 *   type="email"
 *   placeholder="seu@email.com"
 *   required
 * />
 * ```
 */
export const Input = ({
  label,
  icon: Icon,
  error,
  containerClassName,
  showRequired,
  showPasswordToggle,
  className,
  type,
  ...props
}: IInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password" && showPasswordToggle;
  const inputType = isPasswordField && showPassword ? "text" : type;

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
