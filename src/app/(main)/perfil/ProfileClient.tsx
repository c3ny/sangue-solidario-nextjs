"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarUpload } from "@/components/AvatarUpload";
import { IAuthUser } from "@/interfaces/User.interface";
import { uploadAvatar } from "./actions";

export interface IProfileClientProps {
  user: IAuthUser;
}

/**
 * Profile Client Component
 * Handles avatar upload interactions
 */
export const ProfileClient = ({ user }: IProfileClientProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setShowSuccess(false);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const result = await uploadAvatar(formData);

      if (result.success) {
        // Show success animation
        setShowSuccess(true);

        // Hide success animation after 2 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);

        // Refresh the page to show new avatar after animation
        setTimeout(() => {
          router.refresh();
        }, 2500);
      }
      // Errors are handled by the AvatarUpload component
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <AvatarUpload
        currentAvatar={user.avatarPath}
        userName={user.name}
        onUpload={handleUpload}
        isUploading={isUploading}
        showSuccess={showSuccess}
      />
    </>
  );
};
