/**
 * Server Action for Blood Stock Creation
 * Handles blood stock creation on the server side
 */

"use server";

import { getServerUrl } from "@/config/microservices";
import { getAuthToken } from "@/utils/auth";

export interface ICreateBloodstockRequest {
  bloodType: string;
  quantity: number;
  companyId?: string;
}

export interface ICreateBloodstockResult {
  success: boolean;
  message: string;
  data?: {
    id: string;
    bloodType: string;
    quantity: number;
    updateDate: string;
  };
  errors?: Record<string, string>;
}

/**
 * Validate blood stock creation data
 */
function validateBloodstockData(
  data: ICreateBloodstockRequest
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.bloodType || data.bloodType.trim() === "") {
    errors.bloodType = "Tipo sanguíneo é obrigatório";
  } else {
    const validTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validTypes.includes(data.bloodType)) {
      errors.bloodType = "Tipo sanguíneo inválido";
    }
  }

  if (data.quantity === undefined || data.quantity === null) {
    errors.quantity = "Quantidade é obrigatória";
  } else if (data.quantity < 0) {
    errors.quantity = "Quantidade deve ser um número positivo";
  } else if (!Number.isInteger(data.quantity)) {
    errors.quantity = "Quantidade deve ser um número inteiro";
  }

  return errors;
}

/**
 * Create blood stock server action
 */
export async function createBloodstockAction(
  data: ICreateBloodstockRequest
): Promise<ICreateBloodstockResult> {
  try {
    // Validate data
    const errors = validateBloodstockData(data);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Dados inválidos. Por favor, corrija os erros.",
        errors,
      };
    }

    // Get auth token
    const authToken = await getAuthToken();

    // Determine endpoint based on whether companyId is provided
    const baseUrl = getServerUrl("bloodStock", "api/stock");
    const url = data.companyId
      ? `${baseUrl}/company/${data.companyId}`
      : baseUrl;

    // Make API request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({
        blood_type: data.bloodType,
        quantity: data.quantity,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Erro ao criar estoque de sangue",
      }));

      return {
        success: false,
        message:
          error.message || `Erro ao criar estoque: ${response.statusText}`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: "Estoque de sangue criado com sucesso!",
      data: {
        id: result.id,
        bloodType: result.blood_type || result.bloodType,
        quantity: result.quantity,
        updateDate: result.update_date || result.updateDate,
      },
    };
  } catch (error) {
    console.error("Create bloodstock error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro inesperado ao criar estoque de sangue",
    };
  }
}
