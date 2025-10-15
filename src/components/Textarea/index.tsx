import { TextareaHTMLAttributes } from "react";
import styles from "./styles.module.scss";

export interface ITextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text for the textarea
   */
  label?: string;
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
 * Textarea Component
 * A reusable textarea component with label and error handling
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Mensagem"
 *   placeholder="Digite sua mensagem..."
 *   rows={6}
 *   required
 * />
 * ```
 */
export const Textarea = ({
  label,
  error,
  containerClassName,
  showRequired,
  className,
  ...props
}: ITextareaProps) => {
  return (
    <div className={`${styles.formGroup} ${containerClassName || ""}`}>
      {label && (
        <label htmlFor={props.id} className={styles.label}>
          {label}
          {showRequired && <span className={styles.required}> *</span>}
        </label>
      )}
      <textarea
        className={`${styles.textarea} ${error ? styles.textareaError : ""} ${
          className || ""
        }`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

