"use server";

import registrationService from "@/features/Registration/services/registration.service";
import {
  PersonType,
  IDonorRegistration,
  ICompanyRegistration,
} from "@/interfaces/Registration.interface";
import { redirect } from "next/navigation";

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
    birthDate: formData.get("birthDate") as string,
  } as IDonorRegistration;

  try {
    const result = await registrationService.register(rawData);

    if (result.success) {
      redirect("/login?registered=true");
    }

    return { message: "Falha no cadastro. Tente novamente." };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      message:
        "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.",
    };
  } finally {
    redirect("/login?registered=true");
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

    if (result) {
      redirect("/login?registered=true");
    }

    return { message: "Falha no cadastro. Tente novamente." };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      message:
        "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.",
    };
  }
}
