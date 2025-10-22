"use server";

import { cookies } from "next/headers";
import { IAuthUser } from "@/interfaces/User.interface";
import { APIService, isAPISuccess } from "@/service/api/api";
import { getAuthToken } from "@/utils/auth";

const apiService = new APIService();

export interface IUploadAvatarResult {
  success: boolean;
  message: string;
  avatarUrl?: string;
}

/**
 * Upload user avatar to donations-service
 * Sends the file to /users/:id/avatar endpoint
 * Updates user cookie with new avatar URL from API response
 *
 * @param formData - FormData containing the avatar file
 * @returns Upload result with success status and avatar URL
 */
export async function uploadAvatar(
  formData: FormData
): Promise<IUploadAvatarResult> {
  try {
    const file = formData.get("avatar") as File;

    if (!file) {
      return {
        success: false,
        message: "Nenhum arquivo selecionado",
      };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        message: "Arquivo muito grande (máximo 5MB)",
      };
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Tipo de arquivo não permitido (use JPG, PNG ou WEBP)",
      };
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return {
        success: false,
        message: "Usuário não autenticado",
      };
    }

    const user: IAuthUser = JSON.parse(userCookie.value);

    // Get authentication token
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Token de autenticação não encontrado",
      };
    }

    const uploadFormData = new FormData();
    uploadFormData.append("avatar", file);

    const url = apiService.getUsersServiceUrl(`users/${user.id}/avatar`);
    const response = await apiService.postFormData<{ avatarPath: string }>(
      url,
      uploadFormData,
      { token }
    );

    if (!isAPISuccess(response)) {
      return {
        success: false,
        message: response.message || "Erro ao fazer upload da foto",
      };
    }

    const avatarUrl = response.data.avatarPath;

    const updatedUser: IAuthUser = {
      ...user,
      avatarPath: avatarUrl,
    };

    const tokenCookie = cookieStore.get("token");
    const cookieOptions = tokenCookie
      ? {
          maxAge: 60 * 60 * 24 * 30,
        }
      : { maxAge: 60 * 60 * 24 };

    cookieStore.set("user", JSON.stringify(updatedUser), cookieOptions);

    return {
      success: true,
      message: response.message || "Foto atualizada com sucesso!",
      avatarUrl,
    };
  } catch (error) {
    console.error("Avatar upload error:", error);
    return {
      success: false,
      message: "Erro ao fazer upload da foto. Tente novamente.",
    };
  }
}

/**
 * Remove user avatar from donations-service
 * Sends DELETE request to /users/:id/avatar endpoint
 * Updates user cookie to remove avatar
 */
export async function removeAvatar(): Promise<IUploadAvatarResult> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return {
        success: false,
        message: "Usuário não autenticado",
      };
    }

    const user: IAuthUser = JSON.parse(userCookie.value);

    // Get authentication token
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Token de autenticação não encontrado",
      };
    }

    const url = apiService.getUsersServiceUrl(`users/${user.id}/avatar`);
    const response = await apiService.delete(url, { token });

    if (!isAPISuccess(response)) {
      return {
        success: false,
        message: response.message || "Erro ao remover foto",
      };
    }

    const updatedUser: IAuthUser = {
      ...user,
      avatarPath: undefined,
    };

    const tokenCookie = cookieStore.get("token");
    const cookieOptions = tokenCookie
      ? { maxAge: 60 * 60 * 24 * 30 }
      : { maxAge: 60 * 60 * 24 };

    cookieStore.set("user", JSON.stringify(updatedUser), cookieOptions);

    return {
      success: true,
      message: response.message || "Foto removida com sucesso!",
    };
  } catch (error) {
    console.error("Remove avatar error:", error);
    return {
      success: false,
      message: "Erro ao remover foto. Tente novamente.",
    };
  }
}
