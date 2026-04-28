"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarUpload } from "@/components/AvatarUpload";
import { IAuthUser } from "@/interfaces/User.interface";
import { getDefaultAvatarPath } from "@/utils/avatar";
import { uploadAvatar, removeAvatar, setDefaultAvatar } from "./actions";

export interface IProfileClientProps {
  user: IAuthUser;
}

export const ProfileClient = ({ user }: IProfileClientProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [localAvatar, setLocalAvatar] = useState<string | undefined>(
    user.avatarPath,
  );
  const router = useRouter();

  // Sync local optimistic state when the server-side prop settles after refresh.
  useEffect(() => {
    setLocalAvatar(user.avatarPath);
  }, [user.avatarPath]);

  const flashSuccess = () => {
    setShowSuccess(true);
    router.refresh();
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setShowSuccess(false);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const result = await uploadAvatar(formData);

      if (result.success) {
        if (result.avatarUrl) setLocalAvatar(result.avatarUrl);
        flashSuccess();
      } else {
        setUploadError(
          result.message || "Erro ao enviar imagem. Tente novamente.",
        );
      }
    } catch {
      setUploadError(
        "Ocorreu um erro inesperado ao enviar a imagem. Tente novamente.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    setShowSuccess(false);
    setUploadError("");

    try {
      const result = await removeAvatar();
      if (result.success) {
        setLocalAvatar(undefined);
        flashSuccess();
      } else {
        setUploadError(result.message || "Erro ao remover foto.");
      }
    } catch {
      setUploadError("Erro inesperado ao remover foto.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectDefault = async (defaultName: string) => {
    setIsUploading(true);
    setShowSuccess(false);
    setUploadError("");

    // Optimistic: paint the chosen default immediately.
    setLocalAvatar(getDefaultAvatarPath(defaultName));

    try {
      const result = await setDefaultAvatar(defaultName);
      if (result.success) {
        if (result.avatarUrl) setLocalAvatar(result.avatarUrl);
        flashSuccess();
      } else {
        setLocalAvatar(user.avatarPath); // rollback
        setUploadError(result.message || "Erro ao escolher avatar.");
      }
    } catch {
      setLocalAvatar(user.avatarPath); // rollback
      setUploadError("Erro inesperado ao escolher avatar.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AvatarUpload
      currentAvatar={localAvatar}
      userName={user.name}
      personType={user.personType}
      onUpload={handleUpload}
      onRemove={handleRemove}
      onSelectDefault={handleSelectDefault}
      isUploading={isUploading}
      showSuccess={showSuccess}
      uploadError={uploadError}
    />
  );
};
