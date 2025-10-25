"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { BsPerson, BsChevronDown, BsBoxArrowRight } from "react-icons/bs";
import { IAuthUser } from "@/interfaces/User.interface";
import { logout } from "@/app/(auth)/logout-action";
import styles from "./styles.module.scss";

interface UserProfileProps {
  user: IAuthUser;
}

/**
 * User profile dropdown component for the header
 * Shows user's name and avatar/icon with dropdown menu
 */
export const UserProfile = ({ user }: UserProfileProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={styles.userProfileContainer} ref={dropdownRef}>
      <button
        className={styles.userProfile}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className={styles.userIcon}>
          {user.avatarPath ? (
            <img
              src={`http://localhost:3002${user.avatarPath}`}
              alt={`Foto de ${user.name}`}
              className={styles.userAvatar}
            />
          ) : (
            <BsPerson />
          )}
        </div>
        <span className={styles.userName}>{user.name}</span>
        <BsChevronDown
          className={`${styles.chevron} ${
            isDropdownOpen ? styles.chevronOpen : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownContent}>
            <Link
              href="/perfil"
              className={styles.dropdownItem}
              onClick={() => setIsDropdownOpen(false)}
            >
              <BsPerson className={styles.dropdownIcon} />
              <span>Meu Perfil</span>
            </Link>

            <button className={styles.dropdownItem} onClick={handleLogout}>
              <BsBoxArrowRight className={styles.dropdownIcon} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Mobile version of the user profile button with dropdown
 */
export const UserProfileMobile = ({ user }: UserProfileProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={styles.userProfileContainer} ref={dropdownRef}>
      <button
        className={styles.userProfileMobile}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className={styles.userIcon}>
          {user.avatarPath ? (
            <img
              src={`http://localhost:3002${user.avatarPath}`}
              alt={`Foto de ${user.name}`}
              className={styles.userAvatar}
            />
          ) : (
            <BsPerson />
          )}
        </div>
        <span className={styles.userName}>{user.name}</span>
        <BsChevronDown
          className={`${styles.chevron} ${
            isDropdownOpen ? styles.chevronOpen : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdownMobile}>
          <div className={styles.dropdownContent}>
            <Link
              href="/perfil"
              className={styles.dropdownItem}
              onClick={() => setIsDropdownOpen(false)}
            >
              <BsPerson className={styles.dropdownIcon} />
              <span>Meu Perfil</span>
            </Link>

            <button className={styles.dropdownItem} onClick={handleLogout}>
              <BsBoxArrowRight className={styles.dropdownIcon} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
