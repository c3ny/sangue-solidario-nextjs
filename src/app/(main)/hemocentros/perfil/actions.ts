"use server";

import { revalidatePath } from "next/cache";
import { APIService, isAPISuccess } from "@/service/api/api";
import { getAuthToken } from "@/utils/auth";
import { isTokenExpired } from "@/utils/jwt";
import { logger } from "@/utils/logger";
import {
  updateMyCompany,
  updateMyCompanyBanner,
  updateMyCompanyLogo,
} from "@/features/Institution/services/company.service";
import {
  UpdateCompanyInput,
} from "@/features/Institution/schemas/update-company.schema";
import { IInstitution } from "@/features/Institution/interfaces/Institution.interface";

const apiService = new APIService();

export interface ICompanyActionResult {
  success: boolean;
  message: string;
  data?: IInstitution;
}

async function getValidToken(): Promise<string | null> {
  const token = await getAuthToken();
  if (!token || isTokenExpired(token)) return null;
  return token;
}

/** Remove empty strings e valores nulos de campos opcionais para não disparar validações do backend */
function sanitizeCompanyInput(input: UpdateCompanyInput): UpdateCompanyInput {
  return Object.fromEntries(
    Object.entries(input).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  ) as UpdateCompanyInput;
}

/**
 * Update the company's public profile fields.
 */
export async function updateMyCompanyAction(
  input: UpdateCompanyInput
): Promise<ICompanyActionResult> {
  try {
    const token = await getValidToken();
    if (!token) {
      return { success: false, message: "Sessão expirada. Faça login novamente." };
    }

    const updated = await updateMyCompany(sanitizeCompanyInput(input), token);

    revalidatePath("/hemocentros/perfil");
    revalidatePath(`/hemocentro/${updated.username}`);

    return {
      success: true,
      message: "Perfil atualizado com sucesso!",
      data: updated,
    };
  } catch (error) {
    logger.error("updateMyCompanyAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao atualizar perfil",
    };
  }
}

/**
 * Upload a banner (cover) image to CDN and update the company's bannerImage.
 */
export async function uploadBannerAction(
  formData: FormData
): Promise<ICompanyActionResult> {
  try {
    const token = await getValidToken();
    if (!token) {
      return { success: false, message: "Sessão expirada. Faça login novamente." };
    }

    const file = formData.get("image") as File | null;
    if (!file) {
      return { success: false, message: "Nenhum arquivo selecionado" };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, message: "Arquivo muito grande (máximo 5MB)" };
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      return { success: false, message: "Use JPG, PNG ou WEBP" };
    }

    const cdnFormData = new FormData();
    cdnFormData.append("image", file);

    const cdnUrl = apiService.getCdnServiceUrl("api/v1/images?folder=banners");
    const cdnResponse = await apiService.postFormData<{ url: string }>(
      cdnUrl,
      cdnFormData,
      { token }
    );

    if (!isAPISuccess(cdnResponse)) {
      return { success: false, message: "Erro ao enviar imagem para CDN" };
    }

    const updated = await updateMyCompanyBanner(cdnResponse.data.url, token);

    revalidatePath("/hemocentros/perfil");
    revalidatePath(`/hemocentro/${updated.username}`);

    return {
      success: true,
      message: "Imagem de capa atualizada!",
      data: updated,
    };
  } catch (error) {
    logger.error("uploadBannerAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao atualizar imagem",
    };
  }
}

/**
 * Upload a logo (profile photo) image to CDN and update the company's logoImage.
 */
export async function uploadLogoAction(
  formData: FormData
): Promise<ICompanyActionResult> {
  try {
    const token = await getValidToken();
    if (!token) {
      return { success: false, message: "Sessão expirada. Faça login novamente." };
    }

    const file = formData.get("image") as File | null;
    if (!file) {
      return { success: false, message: "Nenhum arquivo selecionado" };
    }

    const maxSize = 3.5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, message: "Arquivo muito grande (máximo 3.5MB)" };
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      return { success: false, message: "Use JPG, PNG ou WEBP" };
    }

    const cdnFormData = new FormData();
    cdnFormData.append("image", file);

    const cdnUrl = apiService.getCdnServiceUrl("api/v1/images?folder=logos");
    const cdnResponse = await apiService.postFormData<{ url: string }>(
      cdnUrl,
      cdnFormData,
      { token }
    );

    if (!isAPISuccess(cdnResponse)) {
      return { success: false, message: "Erro ao enviar imagem para CDN" };
    }

    const updated = await updateMyCompanyLogo(cdnResponse.data.url, token);

    revalidatePath("/hemocentros/perfil");
    revalidatePath(`/hemocentro/${updated.username}`);

    return {
      success: true,
      message: "Logotipo atualizado!",
      data: updated,
    };
  } catch (error) {
    logger.error("uploadLogoAction error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao atualizar logo",
    };
  }
}
