"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarUpload } from "@/components/AvatarUpload";
import { IAuthUser } from "@/interfaces/User.interface";
import { uploadAvatar } from "./actions";

export interface IProfileClientProps {
  user: IAuthUser;
}

export const ProfileClient = ({ user }: IProfileClientProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const router = useRouter();

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setShowSuccess(false);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const result = await uploadAvatar(formData);

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setTimeout(() => router.refresh(), 2500);
      } else {
        setUploadError(result.message || "Erro ao enviar imagem. Tente novamente.");
      }
    } catch {
      setUploadError("Ocorreu um erro inesperado ao enviar a imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AvatarUpload
      currentAvatar={user.avatarPath}
      userName={user.name}
      onUpload={handleUpload}
      isUploading={isUploading}
      showSuccess={showSuccess}
      uploadError={uploadError}
    />
  );
};
