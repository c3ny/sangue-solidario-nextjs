"use client";

import { PropsWithChildren, useState, useRef, useEffect } from "react";
import styles from "./styles.module.scss";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface ITooltipProps {
  /**
   * Tooltip message to display
   */
  message: string;
  /**
   * Position of the tooltip relative to the trigger element
   * @default "top"
   */
  position?: TooltipPosition;
  /**
   * Delay before showing tooltip (in milliseconds)
   * @default 200
   */
  delay?: number;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Disable the tooltip
   */
  disabled?: boolean;
}

/**
 * Tooltip component that displays a message on hover
 *
 * @example
 * ```tsx
 * <Tooltip message="This is a warning">
 *   <PiWarningOctagonFill color="#dc3545" />
 * </Tooltip>
 * ```
 */
export const Tooltip = ({
  children,
  message,
  position = "top",
  delay = 200,
  className = "",
  disabled = false,
}: PropsWithChildren<ITooltipProps>) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      className={`${styles.tooltipWrapper} ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`${styles.tooltip} ${styles[position]}`}
          role="tooltip"
          aria-live="polite"
        >
          <span className={styles.tooltipMessage}>{message}</span>
          <span className={styles.tooltipArrow} aria-hidden="true" />
        </div>
      )}
    </div>
  );
};
