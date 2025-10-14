import styles from "./styles.module.scss";
import { FaUserAlt } from "react-icons/fa";

export interface IImagePlaceholderProps {
  className?: string;
}

export const ImagePlaceholder = ({ className }: IImagePlaceholderProps) => {
  return (
    <div className={`${styles.imagePlaceholder} ${className}`}>
      <FaUserAlt size={65} color="#989898" />
    </div>
  );
};
