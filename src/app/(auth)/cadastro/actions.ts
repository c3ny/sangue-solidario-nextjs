"use server";

import registrationService from "@/features/Registration/services/registration.service";
import { logger } from "@/utils/logger";
import {
  Gender,
  PersonType,
  IDonorRegistration,
  ICompanyRegistration,
} from "@/interfaces/Registration.interface";
import { redirect } from "next/navigation";
import { isAtLeast18, toISODate } from "@/utils/date-validation";
import { unmaskPhone } from "@/utils/masks";

/**
 * Converte mes (1-12) + ano em string YYYY-MM-01. Retorna null quando
 * qualquer um faltar. O dia 01 e convencional — coletamos apenas mes/ano
 * no form, mas persistimos como DATE no banco para permitir comparacoes.
 */
function buildLastDonationDate(
  month: string,
  year: string
): string | null {
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(m) || m < 1 || m > 12) return null;
  if (!Number.isInteger(y) || y < 1900) return null;
  return `${y}-${String(m).padStart(2, "0")}-01`;
}

export interface FormState {
  errors?: {
    [key: string]: string;
  };
  message?: string;
  success?: boolean;
}

export async function registerDonor(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawBirthDate = formData.get("birthDate") as string;

  if (!isAtLeast18(rawBirthDate)) {
    return {
      errors: { birthDate: "Você precisa ter pelo menos 18 anos para se cadastrar" },
    };
  }

  const rawGender = formData.get("gender") as string | null;
  if (rawGender !== Gender.MALE && rawGender !== Gender.FEMALE) {
    return {
      errors: { gender: "Selecione o sexo biológico" },
    };
  }

  const neverDonated = formData.get("neverDonated") === "on";
  let lastDonationDate: string | null = null;
  if (!neverDonated) {
    const month = (formData.get("lastDonationMonth") as string) ?? "";
    const year = (formData.get("lastDonationYear") as string) ?? "";
    lastDonationDate = buildLastDonationDate(month, year);
    if (!lastDonationDate) {
      return {
        errors: {
          lastDonationDate:
            "Informe mês e ano da última doação ou marque \"Nunca doei\"",
        },
      };
    }
  }

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: unmaskPhone((formData.get("phone") as string) ?? ""),
    city: formData.get("city") as string,
    uf: formData.get("uf") as string,
    zipcode: formData.get("zipcode") as string,
    personType: PersonType.DONOR,
    cpf: formData.get("cpf") as string,
    bloodType: formData.get("bloodType") as string,
    birthDate: toISODate(rawBirthDate),
    gender: rawGender as Gender,
    lastDonationDate,
  } as IDonorRegistration;

  try {
    const result = await registrationService.register(rawData);

    if (result.success) {
      redirect("/login?registered=true");
    }

    if (result.message === "UserAlreadyExists") {
      return {
        errors: {
          email:
            "Este e-mail já está cadastrado. Use outro endereço ou faça login.",
        },
      };
    }

    if (result.message === "DonorAlreadyExists") {
      return {
        errors: { cpf: "Este CPF já está cadastrado." },
      };
    }

    return { message: "Falha no cadastro. Tente novamente." };
  } catch (error) {
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw error; // ✅ deixa o Next.js processar o redirect
    }

    logger.error("Registration error:", error);
    return {
      message:
        "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.",
    };
  }
}

export async function registerCompany(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: unmaskPhone((formData.get("phone") as string) ?? ""),
    city: formData.get("city") as string,
    uf: formData.get("uf") as string,
    zipcode: formData.get("zipcode") as string,
    personType: PersonType.COMPANY,
    cnpj: formData.get("cnpj") as string,
    institutionName: formData.get("institutionName") as string,
    cnes: formData.get("cnes") as string,
  } as ICompanyRegistration;

  try {
    const result = await registrationService.register(rawData);

    if (result.success) {
      redirect("/login?registered=true");
    }

    if (result.message === "UserAlreadyExists") {
      return {
        errors: {
          email:
            "Este e-mail já está cadastrado. Use outro endereço ou faça login.",
        },
      };
    }

    return { message: "Falha no cadastro. Tente novamente." };
  } catch (error) {
    if ((error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw error; // ✅ deixa o Next.js processar o redirect
    }

    logger.error("Registration error:", error);
    return {
      message:
        "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.",
    };
  }
}