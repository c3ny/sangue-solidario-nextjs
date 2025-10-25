"use server";

import { createAPIService, isAPISuccess } from "@/service/api/enhanced-api";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/actions/auth/authenticated-action";

export interface ICreateDonationData {
  name: string;
  phone: string;
  bloodType: string;
  quantity: number;
  address: string;
  startDate: string | null;
  endDate: string | null;
  content: string;
}

export interface ICreateDonationResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string>;
}

/**
 * Create donation server action (authenticated)
 * Uses server context for URL resolution and authentication
 */
export const createDonationAction = withAuth(async function (
  user: any,
  token: string,
  data: ICreateDonationData
): Promise<ICreateDonationResult> {
  try {
    // Validate required fields
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = "Nome é obrigatório";
    }

    if (!data.phone?.trim()) {
      errors.phone = "Telefone é obrigatório";
    }

    if (!data.bloodType?.trim()) {
      errors.bloodType = "Tipo sanguíneo é obrigatório";
    }

    if (!data.address?.trim()) {
      errors.address = "Endereço é obrigatório";
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Dados inválidos. Por favor, corrija os erros.",
        errors,
      };
    }

    // Create API service for server context
    const api = createAPIService("server");

    // Prepare payload
    const payload = {
      status: "PENDING",
      content: data.content || "",
      startDate: data.startDate,
      finishDate: data.endDate,
      bloodType: data.bloodType,
      location: {
        latitude: 0, // You might want to geocode the address
        longitude: 0,
      },
      userId: user.id, // Use authenticated user ID
      name: data.name,
      image: null,
    };

    // Make API call with authentication
    const url = api.getDonationServiceUrl("donations");
    const result = await api.post(url, payload, { token });

    if (isAPISuccess(result)) {
      // Revalidate the donations list page
      revalidatePath("/solicitacoes");

      return {
        success: true,
        message: result.message || "Solicitação criada com sucesso!",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Erro ao criar solicitação",
    };
  } catch (error) {
    console.error("Create donation server action error:", error);
    return {
      success: false,
      message: "Erro inesperado no servidor. Tente novamente.",
    };
  }
});
