"use client";

import Link from "next/link";
import { BsPerson } from "react-icons/bs";
import { IAuthUser } from "@/interfaces/User.interface";
import styles from "./styles.module.scss";

interface UserProfileProps {
  user: IAuthUser;
}

/**
 * User profile button component for the header
 * Shows user's name and avatar/icon, links to profile page
 */
export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <Link href="/perfil" className={styles.userProfile}>
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
    </Link>
  );
};

/**
 * Mobile version of the user profile button
 */
export const UserProfileMobile = ({ user }: UserProfileProps) => {
  return (
    <Link href="/perfil" className={styles.userProfileMobile}>
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
    </Link>
  );
};
