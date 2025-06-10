import { Orientation, Variation } from "@/interfaces/Components.interface";
import Link from "next/link";
import styles from "./styles.module.scss";
import { Button } from "../Button";

export interface INavbarProps {
  orientation?: Orientation;
  variation?: Variation;
}

export const Navbar = ({
  orientation = "horizontal",
  variation = "base",
}: INavbarProps) => {
  return (
    <ul className={`${styles.navbarContainer} ${styles[orientation]}`}>
      <li className={`${styles.navItem} ${styles[variation]}`}>
        <Link href="/">HOME</Link>
      </li>
      <li className={`${styles.navItem} ${styles[variation]}`}>
        <Link href="#sobre">SOBRE NÓS</Link>
      </li>
      <li className={`${styles.navItem} ${styles[variation]}`}>
        <Link href="/contato">CONTATO</Link>
      </li>
      <li className={`${styles.navItem} ${styles[variation]}`}>
        <Link href="/solicitacoes">DOE</Link>
      </li>
      <li className={`${styles.navItem} ${styles[variation]}`}>
        <Button>LOGIN</Button>
      </li>
    </ul>
  );
};
