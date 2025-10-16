import { HTMLAttributes } from "react";
import styles from "./styles.module.scss";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "primary" | "secondary" | "white" | "dark";

export interface ISpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the spinner
   * @default "md"
   */
  size?: SpinnerSize;
  /**
   * Visual variant/color of the spinner
   * @default "primary"
   */
  variant?: SpinnerVariant;
  /**
   * Center the spinner in its container
   * @default false
   */
  centered?: boolean;
  /**
   * Optional label for accessibility
   */
  label?: string;
  /**
   * Show label text below spinner
   * @default false
   */
  showLabel?: boolean;
}

/**
 * Spinner Component
 * A loading spinner with multiple sizes and color variants
 *
 * @example
 * ```tsx
 * import { Spinner } from "@/components/Spinner";
 *
 * // Basic usage
 * <Spinner />
 *
 * // With size and variant
 * <Spinner size="lg" variant="primary" />
 *
 * // Centered with label
 * <Spinner centered showLabel label="Carregando dados..." />
 * ```
 */
export const Spinner = ({
  size = "md",
  variant = "primary",
  centered = false,
  label = "Carregando...",
  showLabel = false,
  className = "",
  ...props
}: ISpinnerProps) => {
  const containerClasses = `
    ${styles.spinnerContainer}
    ${centered ? styles.centered : ""}
    ${className}
  `.trim();

  const spinnerClasses = `
    ${styles.spinner}
    ${styles[size]}
    ${styles[variant]}
  `.trim();

  return (
    <div className={containerClasses} role="status" aria-label={label} {...props}>
      <div className={spinnerClasses} aria-hidden="true">
        <div className={styles.spinnerCircle}></div>
      </div>
      {showLabel && <span className={styles.label}>{label}</span>}
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
};

/**
 * FullPageSpinner Component
 * A full-page loading spinner with overlay
 *
 * @example
 * ```tsx
 * import { FullPageSpinner } from "@/components/Spinner";
 *
 * <FullPageSpinner label="Carregando aplicação..." />
 * ```
 */
export const FullPageSpinner = ({
  label = "Carregando...",
  variant = "primary",
}: {
  label?: string;
  variant?: SpinnerVariant;
}) => {
  return (
    <div className={styles.fullPageSpinner}>
      <div className={styles.fullPageContent}>
        <Spinner size="xl" variant={variant} showLabel label={label} />
      </div>
    </div>
  );
};

/**
 * InlineSpinner Component
 * A small spinner for inline use (e.g., in buttons)
 *
 * @example
 * ```tsx
 * import { InlineSpinner } from "@/components/Spinner";
 *
 * <button>
 *   <InlineSpinner /> Salvando...
 * </button>
 * ```
 */
export const InlineSpinner = ({
  variant = "white",
}: {
  variant?: SpinnerVariant;
}) => {
  return (
    <span className={styles.inlineSpinner}>
      <Spinner size="sm" variant={variant} />
    </span>
  );
};

