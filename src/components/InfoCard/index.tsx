import { IconType } from "react-icons";
import styles from "./styles.module.scss";

export interface IInfoCardProps {
  icon?: IconType;
  title: string;
  items: string[];
  iconColor?: "primary" | "success" | "info" | "warning" | "danger";
  variant?: "primary" | "success" | "info" | "warning" | "danger";
  className?: string;
}

export const InfoCard = ({
  icon: Icon,
  title,
  items,
  iconColor = "info",
  variant = "info",
  className = "",
}: IInfoCardProps) => {
  const variantClass =
    styles[`variant${variant.charAt(0).toUpperCase()}${variant.slice(1)}`];
  const iconColorClass =
    styles[`icon${iconColor.charAt(0).toUpperCase()}${iconColor.slice(1)}`];

  return (
    <div className={`${styles.infoCard} ${variantClass} ${className}`}>
      {Icon && <Icon className={`${styles.icon} ${iconColorClass}`} />}
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={index} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
