import React from "react";
import { BsImageFill, BsStars } from "react-icons/bs";
import styles from "../styles.module.scss";

interface StepExtraInfoProps {
  content: string;
  selectedImage: File | null;
  imagePreview: string | null;
  imageError: string | null;
  isGenerating: boolean;
  onContentChange: (value: string) => void;
  onGenerateDescription: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function StepExtraInfo({
  content,
  selectedImage,
  imagePreview,
  imageError,
  isGenerating,
  onContentChange,
  onGenerateDescription,
  onImageChange,
  onRemoveImage,
}: StepExtraInfoProps) {
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>
        <BsImageFill className={styles.headingIcon} />
        Informações Complementares
      </h2>
      <div className={styles.formGrid}>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <div className={styles.labelRow}>
            <label htmlFor="content" className={styles.label}>
              Descrição da solicitação
            </label>
            <button
              type="button"
              className={styles.aiButton}
              onClick={onGenerateDescription}
              disabled={isGenerating}
              title="Gerar descrição automaticamente com Gemini AI"
            >
              <BsStars />
              {isGenerating ? "Gerando..." : "Gerar com IA"}
            </button>
          </div>
          <textarea
            className={styles.textarea}
            id="content"
            rows={5}
            placeholder="Adicione informações adicionais que possam ajudar os doadores (opcional)"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          />
          <span className={styles.helpText}>
            Informações sobre a urgência, histórico ou condições especiais
          </span>
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="image" className={styles.label}>
            Foto do paciente (opcional)
          </label>
          <div className={styles.fileUpload}>
            <input
              className={styles.fileInput}
              type="file"
              id="image"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onImageChange}
            />
            <label htmlFor="image" className={styles.fileLabel}>
              <BsImageFill className={styles.fileIcon} />
              <span className={styles.fileText}>
                {selectedImage ? selectedImage.name : "Clique para selecionar uma imagem"}
              </span>
            </label>
          </div>
          {imageError && (
            <span className={styles.error} role="alert">
              {imageError}
            </span>
          )}
          {imagePreview && (
            <div className={styles.imagePreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview da imagem selecionada"
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={onRemoveImage}
                className={styles.removeImageButton}
                aria-label="Remover imagem"
              >
                ×
              </button>
            </div>
          )}
          <span className={styles.helpText}>Formatos aceitos: JPG, PNG, WEBP (máximo 5MB)</span>
        </div>
      </div>
    </div>
  );
}
