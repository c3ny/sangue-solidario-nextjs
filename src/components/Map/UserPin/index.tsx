import { Location } from "@/interfaces/Solicitations.interface";
import styles from "./styles.module.scss";

export default function UserPin() {
  return (
    <div className={styles.userPinContainer}>
      <div className={styles.userPin}></div>
    </div>
  );
}
