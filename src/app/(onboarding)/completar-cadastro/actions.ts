"use server";

import { cookies } from "next/headers";
import type { IAuthUser } from "@/interfaces/User.interface";
import { APIService, isAPISuccess } from "@/service/api/api";
import { logger } from "@/utils/logger";
import { getAuthToken } from "@/utils/auth";
import { isTokenExpired } from "@/utils/jwt";
import { signCookie } from "@/utils/cookie-signature";
import { isAtLeast18, toISODate as toISODateUtil } from "@/utils/date-validation";

const apiService = new APIService();

export interface FormState {
  errors?: {
    [key: string]: string;
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
}

const toISODate = (value: string): string => toISODateUtil(value) || value;

async function getSessionContext() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie?.value) {
    return { error: "Usuário não autenticado" as const };
  }

  const user: IAuthUser = JSON.parse(userCookie.value);
  const token = await getAuthToken();

  if (!token) {
    return { error: "Token de autenticação não encontrado" as const };
  }

  if (isTokenExpired(token)) {
    return { error: "Sessão expirada. Por favor, faça login novamente." as const };
  }

  return { user, token, cookieStore };
}

async function updateSessionCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  newToken: string,
  updatedUser: IAuthUser
) {
  const tokenCookie = cookieStore.get("token");
  const cookieOptions = tokenCookie
    ? { maxAge: 60 * 60 * 24 * 30, secure: true, httpOnly: true, sameSite: "lax" as const, path: "/" }
    : { maxAge: 60 * 60 * 24, secure: true, httpOnly: true, sameSite: "lax" as const, path: "/" };

  cookieStore.set("token", signCookie(newToken), cookieOptions);
  cookieStore.set("user", JSON.stringify(updatedUser), cookieOptions);
}

export async function completeDonorProfile(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const session = await getSessionContext();
    if ("error" in session) {
      return { message: session.error };
    }

    const rawBirthDate = formData.get("birthDate") as string;
    if (!isAtLeast18(rawBirthDate)) {
      return {
        errors: { birthDate: "Você precisa ter pelo menos 18 anos para se cadastrar" },
      };
    }

    const data = {
      personType: "DONOR",
      city: formData.get("city") as string,
      uf: formData.get("uf") as string,
      cpf: formData.get("cpf") as string,
      bloodType: formData.get("bloodType") as string,
      birthDate: toISODate(rawBirthDate),
    };

    const url = apiService.getUsersServiceUrl(`users/${session.user.id}/complete-profile`);
    const response = await apiService.patch<{ token: string; user: IAuthUser }>(
      url,
      data,
      { token: session.token }
    );

    if (!isAPISuccess(response)) {
      const errorMsg = (response as { message?: string }).message || "Erro ao completar perfil";

      if (errorMsg.includes("DonorAlreadyExists") || errorMsg.includes("cpf")) {
        return { errors: { cpf: "Este CPF já está cadastrado." } };
      }

      return { message: errorMsg };
    }

    await updateSessionCookies(session.cookieStore, response.data.token, response.data.user);

    return { success: true, redirectTo: "/" };
  } catch (error) {
    logger.error("Complete donor profile error:", error);
    return { message: "Erro ao completar perfil. Tente novamente." };
  }
}

export async function completeCompanyProfile(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const session = await getSessionContext();
    if ("error" in session) {
      return { message: session.error };
    }

    const data = {
      personType: "COMPANY",
      city: formData.get("city") as string,
      uf: formData.get("uf") as string,
      cnpj: formData.get("cnpj") as string,
      institutionName: formData.get("institutionName") as string,
      cnes: formData.get("cnes") as string,
    };

    const url = apiService.getUsersServiceUrl(`users/${session.user.id}/complete-profile`);
    const response = await apiService.patch<{ token: string; user: IAuthUser }>(
      url,
      data,
      { token: session.token }
    );

    if (!isAPISuccess(response)) {
      const errorMsg = (response as { message?: string }).message || "Erro ao completar perfil";
      return { message: errorMsg };
    }

    await updateSessionCookies(session.cookieStore, response.data.token, response.data.user);

    return { success: true, redirectTo: "/" };
  } catch (error) {
    logger.error("Complete company profile error:", error);
    return { message: "Erro ao completar perfil. Tente novamente." };
  }
}
