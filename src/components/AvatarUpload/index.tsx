"use client";

import { useState, useRef, ChangeEvent } from "react";
import { BsPerson, BsCamera, BsCheck } from "react-icons/bs";
import styles from "./styles.module.scss";
import Image from "next/image";

export interface IAvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  showSuccess?: boolean;
  uploadError?: string;
}

export const AvatarUpload = ({
  currentAvatar,
  userName,
  onUpload,
  isUploading = false,
  showSuccess = false,
  uploadError = "",
}: IAvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError(
        `Formato não permitido: ${file.type || "desconhecido"}. Use JPG, PNG ou WEBP.`
      );
      return;
    }

    const maxSize = 3.5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(
        `A imagem é muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo permitido: 3.5MB.`
      );
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayAvatar = preview || currentAvatar;

  return (
    <div className={styles.avatarUpload}>
      <div className={styles.avatarWrapper}>
        <div
          className={`${styles.avatar} ${isUploading ? styles.uploading : ""}`}
        >
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt={`Foto de ${userName}`}
              className={styles.avatarImage}
              width={150}
              height={150}
            />
          ) : (
            <BsPerson className={styles.avatarPlaceholder} />
          )}

          {isUploading && (
            <div className={styles.uploadingOverlay}>
              <div className={styles.spinner} />
              <span className={styles.uploadingText}>Enviando...</span>
            </div>
          )}

          {showSuccess && (
            <div className={styles.successOverlay}>
              <div className={styles.successCircle}>
                <BsCheck className={styles.successIcon} />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className={styles.uploadButton}
          aria-label="Alterar foto de perfil"
        >
          <BsCamera />
          <span>Alterar foto</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className={styles.fileInput}
        aria-label="Selecionar foto de perfil"
      />

      {(error || uploadError) && (
        <div className={styles.error} role="alert">
          {error || uploadError}
        </div>
      )}

      <div className={styles.hint}>
        <p>JPG, PNG ou WEBP. Máximo 3.5MB.</p>
      </div>
    </div>
  );
};
