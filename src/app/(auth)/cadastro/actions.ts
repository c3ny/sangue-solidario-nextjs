"use server";

import registrationService from "@/features/Registration/services/registration.service";
import {
  PersonType,
  IDonorRegistration,
  ICompanyRegistration,
} from "@/interfaces/Registration.interface";
import { redirect } from "next/navigation";

/** Converte DD/MM/YYYY ou DDMMYYYY para YYYY-MM-DD (formato ISO esperado pelo PostgreSQL) */
function toISODate(value: string): string {
  if (!value) return value;
  // Formato DD/MM/YYYY
  if (value.includes("/")) {
    const parts = value.split("/");
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  // Formato DDMMYYYY (sem separadores — resultado do unmaskDate)
  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
  }
  return value;
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
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    city: formData.get("city") as string,
    uf: formData.get("uf") as string,
    zipcode: formData.get("zipcode") as string,
    personType: PersonType.DONOR,
    cpf: formData.get("cpf") as string,
    bloodType: formData.get("bloodType") as string,
    birthDate: toISODate(formData.get("birthDate") as string),
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

    console.error("Registration error:", error);
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

    console.error("Registration error:", error);
    return {
      message:
        "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.",
    };
  }
}