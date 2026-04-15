"use server";

import { cookies } from "next/headers";
import { IAuthUser } from "@/interfaces/User.interface";
import { APIService, isAPISuccess } from "@/service/api/api";
import { getAuthToken } from "@/utils/auth";
import { isTokenExpired } from "@/utils/jwt";
import { signCookie, unsignCookie } from "@/utils/cookie-signature";
import { logger } from "@/utils/logger";

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

    // Upload image to CDN service first
    const cdnFormData = new FormData();
    cdnFormData.append("image", file);

    const cdnUrl = apiService.getCdnServiceUrl("api/v1/images?folder=avatars");
    const cdnResponse = await apiService.postFormData<{
      url: string;
      publicId: string;
    }>(cdnUrl, cdnFormData, { token });

    if (!isAPISuccess(cdnResponse)) {
      return {
        success: false,
        message: cdnResponse.message || "Erro ao fazer upload da foto",
      };
    }

    const avatarUrl = cdnResponse.data.url;

    // Update user avatar path with Cloudinary URL
    const url = apiService.getUsersServiceUrl(`users/${user.id}/avatar`);
    const response = await apiService.postFormData<{ avatarPath: string }>(
      url,
      (() => {
        const fd = new FormData();
        fd.append("avatarUrl", avatarUrl);
        return fd;
      })(),
      { token }
    );

    if (!isAPISuccess(response)) {
      return {
        success: false,
        message: response.message || "Erro ao atualizar avatar",
      };
    }

    const updatedUser: IAuthUser = {
      ...user,
      avatarPath: avatarUrl,
    };

    const tokenCookie = cookieStore.get("token");
    const cookieOptions = tokenCookie
      ? {
          maxAge: 60 * 60 * 24 * 30,
          secure: true,
          httpOnly: true,
          sameSite: 'lax' as const,
        }
      : {
          maxAge: 60 * 60 * 24,
          secure: true,
          httpOnly: true,
          sameSite: 'lax' as const,
        };

    cookieStore.set("user", JSON.stringify(updatedUser), cookieOptions);

    return {
      success: true,
      message: response.message || "Foto atualizada com sucesso!",
      avatarUrl,
    };
  } catch (error) {
    logger.error("Avatar upload error:", error);
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
export interface ICompleteProfileData {
  personType: "DONOR" | "COMPANY";
  city: string;
  uf: string;
  cpf?: string;
  bloodType?: string;
  birthDate?: string;
  cnpj?: string;
  institutionName?: string;
  cnes?: string;
}

export interface ICompleteProfileResult {
  success: boolean;
  message: string;
}

export async function completeProfile(
  data: ICompleteProfileData
): Promise<ICompleteProfileResult> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie?.value) {
      return { success: false, message: "Usuário não autenticado" };
    }

    const user: IAuthUser = JSON.parse(userCookie.value);

    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Token de autenticação não encontrado" };
    }

    if (isTokenExpired(token)) {
      return { success: false, message: "Sessão expirada. Por favor, faça login novamente." };
    }

    const url = apiService.getUsersServiceUrl(`users/${user.id}/complete-profile`);
    const response = await apiService.patch<{ token: string; user: IAuthUser }>(
      url,
      data,
      { token }
    );

    if (!isAPISuccess(response)) {
      return { success: false, message: (response as { message: string }).message || "Erro ao completar perfil" };
    }

    const { token: newToken, user: updatedUser } = response.data;

    const tokenCookie = cookieStore.get("token");
    const cookieOptions = tokenCookie
      ? { maxAge: 60 * 60 * 24 * 30, secure: true, httpOnly: true, sameSite: "lax" as const }
      : { maxAge: 60 * 60 * 24, secure: true, httpOnly: true, sameSite: "lax" as const };

    cookieStore.set("token", signCookie(newToken), cookieOptions);
    cookieStore.set("user", JSON.stringify(updatedUser), cookieOptions);

    return { success: true, message: "Perfil completado com sucesso!" };
  } catch (error) {
    logger.error("Complete profile error:", error);
    return { success: false, message: "Erro ao completar perfil. Tente novamente." };
  }
}

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

    const user: IAuthUser = JSON.parse(userCookie.value);

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
      ? {
          maxAge: 60 * 60 * 24 * 30,
          secure: true,
          httpOnly: true,
          sameSite: 'lax' as const,
        }
      : {
          maxAge: 60 * 60 * 24,
          secure: true,
          httpOnly: true,
          sameSite: 'lax' as const,
        };

    cookieStore.set("user", JSON.stringify(updatedUser), cookieOptions);

    return {
      success: true,
      message: response.message || "Foto removida com sucesso!",
    };
  } catch (error) {
    logger.error("Remove avatar error:", error);
    return {
      success: false,
      message: "Erro ao remover foto. Tente novamente.",
    };
  }
}
