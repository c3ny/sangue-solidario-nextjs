"use client";

import { Modal } from "@/components/Modal";
import styles from "./styles.module.scss";

export type ConfirmVariant = "primary" | "danger";

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmLabel,
  variant = "primary",
  isLoading = false,
  error,
  onConfirm,
  onClose,
}: ConfirmActionModalProps) {
  const confirmClass =
    variant === "danger"
      ? `${styles.modalConfirm} ${styles.modalConfirmDanger}`
      : `${styles.modalConfirm} ${styles.modalConfirmPrimary}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => (isLoading ? null : onClose())}
      title={title}
      size="small"
    >
      <p style={{ margin: 0, color: "#495057", lineHeight: 1.5 }}>{message}</p>

      {error && <div className={styles.modalError}>{error}</div>}

      <div className={styles.modalActions}>
        <button
          type="button"
          className={styles.modalCancel}
          onClick={onClose}
          disabled={isLoading}
        >
          Voltar
        </button>
        <button
          type="button"
          className={confirmClass}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Processando..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
