"use client";

import { BsDroplet, BsExclamationTriangle } from "react-icons/bs";
import { Bloodstock } from "@/lib/api";
import { Card } from "@/components/Card";
import styles from "./styles.module.scss";

interface IBloodStockCardProps {
  stocks: Bloodstock[];
  isLoading?: boolean;
}

/**
 * Calculate stock status based on quantity
 */
const getStockStatus = (quantity: number): "critical" | "low" | "good" => {
  if (quantity < 20) return "critical";
  if (quantity < 50) return "low";
  return "good";
};

/**
 * Calculate percentage (assuming max capacity of 100)
 */
const calculatePercentage = (quantity: number): number => {
  const maxCapacity = 100;
  return Math.min((quantity / maxCapacity) * 100, 100);
};

/**
 * Blood Stock Card Component
 * Displays blood stock levels for each blood type
 */
export const BloodStockCard = ({
  stocks,
  isLoading = false,
}: IBloodStockCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return styles.critical;
      case "low":
        return styles.low;
      case "good":
        return styles.good;
      default:
        return "";
    }
  };

  const criticalStocks = stocks.filter(
    (stock) => getStockStatus(stock.quantity) === "critical"
  );

  if (isLoading) {
    return (
      <Card className={styles.bloodStockCard}>
        <div className={styles.loading}>
          <p>Carregando estoque...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={styles.bloodStockCard}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <BsDroplet className={styles.icon} />
          <h2 className={styles.title}>Estoque de Sangue</h2>
        </div>
        {criticalStocks.length > 0 && (
          <div className={styles.alertBadge}>
            <BsExclamationTriangle />
            <span>{criticalStocks.length} crítico(s)</span>
          </div>
        )}
      </div>

      {stocks.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum estoque encontrado.</p>
        </div>
      ) : (
        <div className={styles.stockGrid}>
          {stocks.map((stock) => {
            const status = getStockStatus(stock.quantity);
            const percentage = calculatePercentage(stock.quantity);

            return (
              <div key={stock.id} className={styles.stockItem}>
                <div className={styles.stockHeader}>
                  <span className={styles.bloodType}>{stock.bloodType}</span>
                  <div className={styles.stockInfo}>
                    <span className={styles.quantity}>
                      {stock.quantity} unidades
                    </span>
                    <span className={styles.percentage}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${getStatusColor(
                      status
                    )}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {status === "critical" && (
                  <div className={styles.criticalWarning}>
                    <BsExclamationTriangle />
                    <span>Estoque crítico</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
