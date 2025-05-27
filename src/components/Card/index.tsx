import { AllHTMLAttributes, PropsWithChildren } from "react";
import styles from "./styles.module.scss";

export type ICardProps = AllHTMLAttributes<HTMLDivElement>;

export const Card = ({
  children,
  className,
  ...props
}: PropsWithChildren<ICardProps>) => {
  return (
    <div className={`${styles.card} ${className}`} {...props}>
      {children}
    </div>
  );
};
