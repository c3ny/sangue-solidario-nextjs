import { ReactNode } from "react";
import styles from "./styles.module.scss";

export interface IBadgeProps {
  /**
   * Icon to display on the left side of the badge
   */
  icon?: ReactNode;
  /**
   * Text content of the badge
   */
  children: ReactNode;
  /**
   * Visual variant of the badge
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * Badge Component
 * Displays a small label with optional icon, commonly used for tags, categories, or status indicators
 *
 * @example
 * ```tsx
 * <Badge icon={<BsHeart />} variant="danger">
 *   Plataforma de Doação de Sangue
 * </Badge>
 * ```
 */
export const Badge = ({
  icon,
  children,
  variant = "primary",
  className = "",
}: IBadgeProps) => {
  return (
    <div
      className={`${styles.badge} ${styles[`badge--${variant}`]} ${className}`}
    >
      {icon && <span className={styles.badgeIcon}>{icon}</span>}
      <span className={styles.badgeText}>{children}</span>
    </div>
  );
};
