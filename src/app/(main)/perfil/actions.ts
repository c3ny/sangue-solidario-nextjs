"use server";

import { cookies } from "next/headers";
import { IAuthUser } from "@/interfaces/User.interface";
import { APIService, isAPISuccess } from "@/service/api/api";
import { getAuthToken } from "@/utils/auth";
import { isTokenExpired } from "@/utils/jwt";
import { unsignCookie } from "@/utils/cookie-signature";

const apiService = new APIService();

export interface IUploadAvatarResult {
  success: boolean;
  message: string;
  avatarUrl?: string;
}

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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        message: "Arquivo muito grande (máximo 5MB)",
      };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Tipo de arquivo não permitido (use JPG, PNG ou WEBP)",
      };
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie?.value) {
      return {
        success: false,
        message: "Usuário não autenticado",
      };
    }

    const user: IAuthUser = JSON.parse(userCookie.value);

    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: "Token de autenticação não encontrado",
      };
    }

    if (isTokenExpired(token)) {
      return {
        success: false,
        message: "Sessão expirada. Por favor, faça login novamente.",
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

    if (!userCookie?.value) {
      return {
        success: false,
        message: "Usuário não autenticado",
      };
    }

    // Verify and unsign the cookie
    const unsignedValue = unsignCookie(userCookie.value);
    if (!unsignedValue) {
      return {
        success: false,
        message: "Cookie inválido ou corrompido",
      };
    }

    const user: IAuthUser = JSON.parse(unsignedValue);

    // Get authentication token
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Token de autenticação não encontrado",
      };
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      return {
        success: false,
        message: "Sessão expirada. Por favor, faça login novamente.",
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
