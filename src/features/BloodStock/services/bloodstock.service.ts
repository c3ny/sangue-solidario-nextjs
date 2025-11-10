/**
 * Blood Stock Service
 * Service for managing blood stock operations
 */

import { getClientUrl } from "@/config/microservices";
import { getAuthTokenClient } from "@/utils/auth.client";
import {
  IBloodstock,
  ICreateBloodstockRequest,
  ICreateBloodstockWithCompanyRequest,
  ICreateBloodstockResponse,
} from "../interfaces/Bloodstock.interface";

const API_BASE_URL = `${getClientUrl("bloodStock", "api/stock")}`;

/**
 * Create a new blood stock item without company
 */
export async function createBloodstock(
  data: ICreateBloodstockRequest
): Promise<ICreateBloodstockResponse> {
  const authToken = getAuthTokenClient();

  const response = await fetch(API_BASE_URL, {
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
    throw new Error(
      error.message || `Erro ao criar estoque: ${response.statusText}`
    );
  }

  const result = await response.json();
  return {
    id: result.id,
    bloodType: result.blood_type || result.bloodType,
    quantity: result.quantity,
    updateDate: result.update_date || result.updateDate,
  };
}

/**
 * Create a new blood stock item linked to a company
 */
export async function createBloodstockWithCompany(
  data: ICreateBloodstockWithCompanyRequest
): Promise<ICreateBloodstockResponse> {
  const authToken = getAuthTokenClient();

  const response = await fetch(`${API_BASE_URL}/company/${data.companyId}`, {
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
    throw new Error(
      error.message ||
        `Erro ao criar estoque para empresa: ${response.statusText}`
    );
  }

  const result = await response.json();
  return {
    id: result.id,
    bloodType: result.blood_type || result.bloodType,
    quantity: result.quantity,
    updateDate: result.update_date || result.updateDate,
  };
}

/**
 * Get all blood stock items
 */
export async function getAllBloodstock(): Promise<IBloodstock[]> {
  const authToken = getAuthTokenClient();

  const response = await fetch(API_BASE_URL, {
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar estoque: ${response.statusText}`);
  }

  const result = await response.json();
  return result.map((item: any) => ({
    id: item.id,
    bloodType: item.blood_type || item.bloodType,
    quantity: item.quantity,
    updateDate: item.update_date || item.updateDate,
  }));
}

/**
 * Get blood stock by company ID
 */
export async function getBloodstockByCompany(
  companyId: string
): Promise<IBloodstock[]> {
  const authToken = getAuthTokenClient();

  const response = await fetch(`${API_BASE_URL}/company/${companyId}`, {
    headers: {
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Empresa não encontrada");
    }
    throw new Error(
      `Erro ao buscar estoque da empresa: ${response.statusText}`
    );
  }

  const result = await response.json();
  return result.map((item: any) => ({
    id: item.id,
    bloodType: item.blood_type || item.bloodType,
    quantity: item.quantity,
    updateDate: item.update_date || item.updateDate,
    companyId: companyId,
  }));
}

/**
 * Update blood stock quantity
 */
export async function updateBloodstockQuantity(
  bloodstockId: string,
  quantity: number
): Promise<IBloodstock> {
  const authToken = getAuthTokenClient();

  const response = await fetch(
    `${API_BASE_URL}/${bloodstockId}?quantity=${quantity}`,
    {
      method: "PUT",
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erro ao atualizar estoque",
    }));
    throw new Error(
      error.message || `Erro ao atualizar estoque: ${response.statusText}`
    );
  }

  const result = await response.json();
  return {
    id: result.id,
    bloodType: result.blood_type || result.bloodType,
    quantity: result.quantity,
    updateDate: result.update_date || result.updateDate,
  };
}
