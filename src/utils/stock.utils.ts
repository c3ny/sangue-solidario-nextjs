/**
 * Stock management utility functions
 */

/**
 * Format date string to Brazilian format (DD/MM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Format time string to Brazilian format (HH:MM)
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

/**
 * Get stock status based on quantity
 * @param quantity - Current stock quantity
 * @returns Status: "critical" (< 20), "low" (< 50), or "good" (>= 50)
 */
export const getStockStatus = (
  quantity: number
): "critical" | "low" | "good" => {
  if (quantity < 20) return "critical";
  if (quantity < 50) return "low";
  return "good";
};

/**
 * Calculate stock percentage based on maximum capacity
 * @param quantity - Current stock quantity
 * @param maxCapacity - Maximum capacity (default: 100)
 * @returns Percentage value (0-100)
 */
export const calculatePercentage = (
  quantity: number,
  maxCapacity: number = 100
): number => {
  return Math.min((quantity / maxCapacity) * 100, 100);
};

/**
 * Format movement value with sign (+ or -)
 * @param movement - Movement amount (positive or negative)
 * @returns Formatted string with sign prefix
 */
export const formatMovement = (movement: number): string => {
  if (movement > 0) {
    return `+${movement}`;
  }
  return `${movement}`;
};

/**
 * Get movement color class name based on movement value
 * @param movement - Movement amount (positive, negative, or zero)
 * @returns CSS class name for styling
 */
export const getMovementColorClass = (movement: number): string => {
  if (movement > 0) {
    return "movementPositive";
  }
  if (movement < 0) {
    return "movementNegative";
  }
  return "";
};
