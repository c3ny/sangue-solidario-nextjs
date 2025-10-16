"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsSearch, BsList, BsX, BsPerson } from "react-icons/bs";
import { IAuthUser } from "@/interfaces/User.interface";
import { UserProfile, UserProfileMobile } from "./UserProfile";
import styles from "./styles.module.scss";

interface HeaderProps {
  user?: IAuthUser | null;
}

export const Header = ({ user }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/#sobre", label: "Sobre Nós" },
    { href: "/#como-funciona", label: "Como Funciona" },
    { href: "/solicitacoes", label: "Doar Sangue" },
    { href: "/contato", label: "Contato" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/assets/images/logo/sangue-main.svg"
            alt="Sangue Solidário"
            width={180}
            height={54}
            className={styles.logo}
            priority
          />
        </Link>

        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {user ? (
            <UserProfile user={user} />
          ) : (
            <Link href="/login" className={styles.loginButton}>
              <BsPerson className={styles.loginIcon} />
              <span>Entrar</span>
            </Link>
          )}
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <BsX className={styles.menuIcon} />
          ) : (
            <BsList className={styles.menuIcon} />
          )}
        </button>
      </div>

      <div
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.open : ""
        }`}
      >
        <div className={styles.mobileMenuContent}>
          {/* Mobile Search */}
          <div className={styles.mobileSearch}>
            <BsSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar cidade..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={styles.mobileNavLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {user ? (
            <div onClick={() => setIsMobileMenuOpen(false)}>
              <UserProfileMobile user={user} />
            </div>
          ) : (
            <Link
              href="/login"
              className={styles.mobileLoginButton}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BsPerson className={styles.loginIcon} />
              <span>Entrar</span>
            </Link>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};
