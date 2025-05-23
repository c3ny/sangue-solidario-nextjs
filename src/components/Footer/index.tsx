import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../Navbar";
import styles from "./styles.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link href="/">
        <Image
          src="/assets/images/logo/sangue-white.svg"
          alt="Sangue Solidário"
          width={150}
          height={50}
        />
      </Link>

      <Navbar variation="light" />
    </footer>
  );
};
