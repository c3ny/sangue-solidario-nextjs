import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import { Variant } from "@/interfaces/Components.interface";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = ({
  children,
  className,
  variant = "primary",
  ...props
}: PropsWithChildren<IButtonProps>) => {
  return (
    <button
      className={`${className} ${styles.button} ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
