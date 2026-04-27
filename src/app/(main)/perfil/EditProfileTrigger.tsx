"use client";

import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { EditProfileModal } from "./EditProfileModal";
import styles from "./styles.module.scss";

interface EditProfileTriggerProps {
  initialValues: {
    name: string;
    phone: string;
    city: string;
    uf: string;
    zipcode: string;
    description: string;
    gender?: "MALE" | "FEMALE" | null;
    lastDonationDate?: string | null;
  };
  showDonorFields?: boolean;
  /** Texto alternativo para o botao (ex: "Completar dados"). */
  label?: string;
  variant?: "secondary" | "primary";
}

export function EditProfileTrigger({
  initialValues,
  showDonorFields = false,
  label = "Editar perfil",
  variant = "secondary",
}: EditProfileTriggerProps) {
  const [open, setOpen] = useState(false);

  const primaryStyle =
    variant === "primary"
      ? {
          background: "#dc3545",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer",
        }
      : undefined;

  return (
    <>
      <button
        type="button"
        className={variant === "secondary" ? styles.editProfileButton : undefined}
        style={primaryStyle}
        onClick={() => setOpen(true)}
      >
        <BsPencilSquare />
        <span>{label}</span>
      </button>
      <EditProfileModal
        open={open}
        onClose={() => setOpen(false)}
        initialValues={initialValues}
        showDonorFields={showDonorFields}
      />
    </>
  );
}
