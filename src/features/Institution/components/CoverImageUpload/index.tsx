"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import styles from "./styles.module.scss";

interface CoverImageUploadProps {
  currentImage?: string;
  institutionName: string;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  uploadError?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function CoverImageUpload({
  currentImage,
  institutionName,
  onUpload,
  isUploading = false,
  uploadError,
}: CoverImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Use JPG, PNG ou WEBP");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError("Arquivo muito grande (máximo 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    await onUpload(file);
    e.target.value = "";
  };

  const displayImage = preview ?? currentImage;

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.coverArea} ${isUploading ? styles.uploading : ""}`}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Alterar imagem de capa"
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt={`Capa ${institutionName}`}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>🖼️</span>
            <span>Clique para adicionar imagem de capa</span>
            <span className={styles.hint}>JPG, PNG ou WEBP · máx 5MB · proporção 16:5</span>
          </div>
        )}

        <div className={styles.overlay}>
          {isUploading ? (
            <span className={styles.spinnerIcon}>⏳</span>
          ) : (
            <span className={styles.editIcon}>✏️ Alterar capa</span>
          )}
        </div>
      </div>

      {(error ?? uploadError) && (
        <p className={styles.error}>{error ?? uploadError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className={styles.hiddenInput}
        aria-hidden="true"
      />
    </div>
  );
}
