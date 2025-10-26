import styles from "./styles.module.scss";

export interface IBoldProps {
  children: React.ReactNode;
  className?: string;
}

export const Bold = ({ children, className }: IBoldProps) => {
  const boldClasses = `
    ${styles.bold}
    ${className}
  `.trim();

  return <strong className={boldClasses}>{children}</strong>;
};
