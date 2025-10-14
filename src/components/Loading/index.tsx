import styles from "./styles.module.scss";
export interface ILoadingProps {
  className?: string;
  width?: string;
  height?: string;
}
export default function Loading({ className, width, height }: ILoadingProps) {
  return (
    <div
      className={`${styles.loading} ${className}`}
      style={{ width, height }}
    ></div>
  );
}
