"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { BsPerson, BsCamera, BsCheck, BsTrash } from "react-icons/bs";
import Image from "next/image";
import { Modal } from "@/components/Modal";
import {
  DefaultAvatar,
  getDefaultAvatarsForPersonType,
} from "@/utils/avatar";
import styles from "./styles.module.scss";

export interface IAvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  personType?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
  onSelectDefault?: (defaultName: string) => Promise<void>;
  isUploading?: boolean;
  showSuccess?: boolean;
  uploadError?: string;
}

export const AvatarUpload = ({
  currentAvatar,
  userName,
  personType,
  onUpload,
  onRemove,
  onSelectDefault,
  isUploading = false,
  showSuccess = false,
  uploadError = "",
}: IAvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaults = getDefaultAvatarsForPersonType(personType);
  const displayAvatar = preview || currentAvatar;
  const hasAvatar = !!currentAvatar;

  // Drop the local preview as soon as the server-side currentAvatar settles.
  // Without this the data-URL preview would shadow the new prop forever.
  useEffect(() => {
    if (!isUploading) setPreview(null);
  }, [currentAvatar, isUploading]);

  const closeModal = () => setIsModalOpen(false);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");
    e.target.value = "";

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError(
        `Formato não permitido: ${file.type || "desconhecido"}. Use JPG, PNG ou WEBP.`,
      );
      return;
    }

    const maxSize = 3.5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(
        `A imagem é muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo permitido: 3.5MB.`,
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    closeModal();
    onUpload(file);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleRemove = async () => {
    if (!onRemove) return;
    setError("");
    setPreview(null);
    closeModal();
    await onRemove();
  };

  const handleSelectDefault = async (avatar: DefaultAvatar) => {
    if (!onSelectDefault) return;
    setError("");
    setPreview(null);
    closeModal();
    await onSelectDefault(avatar.name);
  };

  return (
    <div className={styles.avatarUpload}>
      <button
        type="button"
        className={styles.avatarTrigger}
        onClick={() => setIsModalOpen(true)}
        disabled={isUploading}
        aria-label="Alterar foto de perfil"
      >
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

          {!isUploading && !showSuccess && (
            <div className={styles.hoverOverlay}>
              <BsCamera className={styles.hoverIcon} />
              <span className={styles.hoverText}>Alterar foto</span>
            </div>
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
      </button>

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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Alterar avatar"
        size="small"
      >
        <div className={styles.modalBody}>
          {onSelectDefault && (
            <>
              <p className={styles.modalLabel}>Escolha um avatar pronto:</p>
              <div
                className={styles.defaultsGrid}
                role="radiogroup"
                aria-label="Avatares padrão"
              >
                {defaults.map((avatar) => (
                  <button
                    key={avatar.name}
                    type="button"
                    role="radio"
                    aria-checked={currentAvatar === avatar.path}
                    aria-label={`Avatar ${avatar.label}`}
                    className={`${styles.defaultThumb} ${
                      currentAvatar === avatar.path
                        ? styles.defaultThumbActive
                        : ""
                    }`}
                    disabled={isUploading}
                    onClick={() => handleSelectDefault(avatar)}
                  >
                    <Image
                      src={avatar.path}
                      alt={`Avatar ${avatar.label}`}
                      width={64}
                      height={64}
                    />
                  </button>
                ))}
              </div>
              <div className={styles.divider} />
            </>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={openFilePicker}
              disabled={isUploading}
              className={styles.primaryAction}
            >
              <BsCamera />
              <span>Enviar foto</span>
            </button>

            {hasAvatar && onRemove && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className={styles.dangerAction}
              >
                <BsTrash />
                <span>Remover</span>
              </button>
            )}
          </div>

          <p className={styles.modalHint}>JPG, PNG ou WEBP. Máximo 3.5MB.</p>
        </div>
      </Modal>
    </div>
  );
};
