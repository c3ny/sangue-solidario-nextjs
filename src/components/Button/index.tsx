import { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { InlineSpinner } from "@/components/Spinner";
import styles from "./styles.module.scss";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "google"
  | "danger"
  | "success"
  | "filter";

export type ButtonSize = "small" | "medium" | "large";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button visual variant
   * @default "primary"
   */
  variant?: ButtonVariant;
  /**
   * Icon to display before text
   */
  iconBefore?: ReactNode;
  /**
   * Icon to display after text
   */
  iconAfter?: ReactNode;
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Active state (for filter variant)
   */
  isActive?: boolean;
  /**
   * Size variant (for filter buttons)
   */
  size?: ButtonSize;
}

export const Button = ({
  children,
  className = "",
  variant = "primary",
  iconBefore,
  iconAfter,
  fullWidth = false,
  isLoading = false,
  isActive = false,
  size = "medium",
  disabled,
  ...props
}: PropsWithChildren<IButtonProps>) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        fullWidth ? styles.fullWidth : ""
      } ${isLoading ? styles.loading : ""} ${isActive ? styles.active : ""} ${
        styles[`size-${size}`]
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <InlineSpinner
            variant={
              variant === "primary" ||
              variant === "danger" ||
              variant === "success"
                ? "white"
                : "primary"
            }
          />
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {iconBefore && (
            <span className={styles.iconBefore}>{iconBefore}</span>
          )}
          <span className={styles.text}>{children}</span>
          {iconAfter && <span className={styles.iconAfter}>{iconAfter}</span>}
        </>
      )}
    </button>
  );
};
