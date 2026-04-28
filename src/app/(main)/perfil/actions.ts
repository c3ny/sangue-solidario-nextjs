"use server";

import { cookies } from "next/headers";
import { IAuthUser } from "@/interfaces/User.interface";
import { APIService, isAPISuccess } from "@/service/api/api";
import { getAuthToken } from "@/utils/auth";
import { isTokenExpired } from "@/utils/jwt";
import { signCookie, unsignCookie } from "@/utils/cookie-signature";
import { logger } from "@/utils/logger";
import { revalidatePath } from "next/cache";
import {
  isValidDefaultAvatarName,
  getDefaultAvatarPath,
} from "@/utils/avatar";

const apiService = new APIService();

export interface IUpdateProfileData {
  name?: string;
  phone?: string;
  city?: string;
  uf?: string;
  zipcode?: string;
  description?: string;
  gender?: "MALE" | "FEMALE";
  /**
   * Data da ultima doacao no formato YYYY-MM-DD (dia 01 para inputs
   * mes/ano). null para limpar (usuario marcou "Nunca doei").
   * undefined mantem o valor atual.
   */
  lastDonationDate?: string | null;
}

export interface IUpdateProfileResult {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export interface ICloseDonationResult {
  success: boolean;
  message: string;
}

export async function closeDonation(
  donationId: string
): Promise<ICloseDonationResult> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Não autenticado" };
    }
    if (isTokenExpired(token)) {
      return { success: false, message: "Sessão expirada" };
    }

    const url = apiService.getDonationServiceUrl(
      `donations/${donationId}/status`
    );
    const response = await apiService.put<unknown>(
      url,
      { status: "COMPLETED" },
      { token }
    );

    if (!isAPISuccess(response)) {
      return {
        success: false,
        message:
          (response as { message?: string }).message ||
          "Erro ao encerrar solicitação",
      };
    }

    revalidatePath("/perfil");
    // Listagem publica tambem precisa refletir o encerramento imediato.
    revalidatePath("/solicitacoes");
    return { success: true, message: "Solicitação encerrada com sucesso" };
  } catch (error) {
    logger.error("Close donation error:", error);
    return { success: false, message: "Erro ao encerrar solicitação" };
  }
}

export async function updateProfile(
  data: IUpdateProfileData
): Promise<IUpdateProfileResult> {
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
      return {
        success: false,
        message: "Sessão expirada. Por favor, faça login novamente.",
      };
    }

    const url = apiService.getUsersServiceUrl(`users/${user.id}`);
    const response = await apiService.patch<IAuthUser>(url, data, { token });

    if (!isAPISuccess(response)) {
      return {
        success: false,
        message:
          (response as { message?: string }).message ||
          "Erro ao atualizar perfil",
      };
    }

    const updatedUser: IAuthUser = { ...user, ...response.data };

    const tokenCookie = cookieStore.get("token");
    const cookieOptions = tokenCookie
      ? {
          maxAge: 60 * 60 * 24 * 30,
          secure: true,
          httpOnly: true,
          sameSite: "lax" as const,
          path: "/",
        }
      : {
          maxAge: 60 * 60 * 24,
          secure: true,
          httpOnly: true,
          sameSite: "lax" as const,
          path: "/",
        };

    cookieStore.set("user", JSON.stringify(updatedUser), cookieOptions);
    revalidatePath("/perfil");

    return { success: true, message: "Perfil atualizado com sucesso!" };
  } catch (error) {
    logger.error("Update profile error:", error);
    return {
      success: false,
      message: "Erro ao atualizar perfil. Tente novamente.",
    };
  }
}

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
    revalidatePath("/perfil");
    revalidatePath("/hemocentros/painel");

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

export async function setDefaultAvatar(
  defaultName: string,
): Promise<IUploadAvatarResult> {
  try {
    if (!isValidDefaultAvatarName(defaultName)) {
      return { success: false, message: "Avatar padrão inválido" };
    }

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
      return {
        success: false,
        message: "Sessão expirada. Por favor, faça login novamente.",
      };
    }

    const avatarUrl = getDefaultAvatarPath(defaultName);

    const url = apiService.getUsersServiceUrl(`users/${user.id}/avatar`);
    const fd = new FormData();
    fd.append("avatarUrl", avatarUrl);
    const response = await apiService.postFormData<{ avatarPath: string }>(
      url,
      fd,
      { token },
    );

    if (!isAPISuccess(response)) {
      return {
        success: false,
        message: response.message || "Erro ao definir avatar padrão",
      };
    }

    const updatedUser: IAuthUser = { ...user, avatarPath: avatarUrl };

    const tokenCookie = cookieStore.get("token");
    const cookieOptions = tokenCookie
      ? {
          maxAge: 60 * 60 * 24 * 30,
          secure: true,
          httpOnly: true,
          sameSite: "lax" as const,
        }
      : {
          maxAge: 60 * 60 * 24,
          secure: true,
          httpOnly: true,
          sameSite: "lax" as const,
        };

    cookieStore.set("user", JSON.stringify(updatedUser), cookieOptions);
    revalidatePath("/perfil");
    revalidatePath("/hemocentros/painel");

    return {
      success: true,
      message: "Avatar atualizado!",
      avatarUrl,
    };
  } catch (error) {
    logger.error("setDefaultAvatar error:", error);
    return { success: false, message: "Erro ao atualizar avatar." };
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
    revalidatePath("/perfil");
    revalidatePath("/hemocentros/painel");

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
