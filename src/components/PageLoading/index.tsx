import { ReactNode } from "react";
import { BsHeart } from "react-icons/bs";
import styles from "./styles.module.scss";

export interface IPageLoadingProps {
  /**
   * Custom title text
   * @default "Carregando..."
   */
  title?: string;
  /**
   * Custom subtitle/description text
   */
  subtitle?: string;
  /**
   * Custom icon to display
   * @default BsHeart
   */
  icon?: ReactNode;
  /**
   * Show progress bar
   * @default true
   */
  showProgress?: boolean;
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * PageLoading Component
 * A full-page loading screen for route transitions
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PageLoading />
 *
 * // Custom title and subtitle
 * <PageLoading
 *   title="Carregando dashboard"
 *   subtitle="Buscando seus agendamentos..."
 * />
 * ```
 */
export const PageLoading = ({
  title = "Carregando...",
  subtitle,
  icon,
  showProgress = true,
  className = "",
}: IPageLoadingProps) => {
  const defaultIcon = <BsHeart className={styles.heartIcon} />;
  const displayIcon = icon || defaultIcon;

  return (
    <div className={`${styles.loadingContainer} ${className}`}>
      <div className={styles.loadingContent}>
        <div className={styles.logoContainer}>
          {displayIcon}
          <div className={styles.pulse}></div>
        </div>
        <h2 className={styles.loadingTitle}>{title}</h2>
        {subtitle && <p className={styles.loadingText}>{subtitle}</p>}
        {showProgress && (
          <div className={styles.loadingBar}>
            <div className={styles.loadingProgress}></div>
          </div>
        )}
      </div>
    </div>
  );
};
