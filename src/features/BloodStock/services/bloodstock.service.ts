/**
 * Blood Stock Service
 * Service for managing blood stock operations
 */

import { getClientUrl } from "@/config/microservices";
import { getAuthTokenClient } from "@/utils/auth.client";
import {
  BloodType,
  IBloodstock,
} from "../interfaces/Bloodstock.interface";

const API_BASE_URL = `${getClientUrl("bloodStock", "api/stock")}`;

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
  const detail = result.bloodDetails?.[0];
  return result.map((item: any) => ({
    id: item.id,
    companyId: companyId,
    batchCode: item.batchCode,
    entryDate: item.entryDate,
    exitDate: item.exitDate,
    bloodType: detail?.bloodType,
    quantity: detail?.quantity,
    updateDate: detail?.updateDate,
  }));
}

  /**
   * 
   * Entrada de lote de sangue
   */
  export async function createBloodstockEntry(
    companyId: string,
    batchCode: string,
    entryDate: string,
    bloodType: BloodType,
    quantity: number
  ): Promise<IBloodstock> {
    const authToken = getAuthTokenClient();

    const response = await fetch(`${API_BASE_URL}/${companyId}/batchEntry`, {
      method: "POST",
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        batchCode,
        entryDate,
        bloodType,
        quantity,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Erro ao criar entrada de estoque",
      }));
      throw new Error(
        error.message || `Erro ao criar entrada de estoque: ${response.statusText}`
      );
    }

    const result = await response.json();
    const detail = result.bloodDetails?.[0];
    return {
      id: result.id,
      batchCode: result.batchCode,
      entryDate: result.entryDate,
      bloodType: detail?.bloodType,
      quantity: detail?.quantity,
    };
  }

  /*
    * Saída de lote de sangue
    */

  export async function createBloodstockExit(
    companyId: string,
    batchCode: string,
    exitDate: string,
    quantity: number
  ): Promise<IBloodstock> {
    const authToken = getAuthTokenClient();
    const response = await fetch(`${API_BASE_URL}/${companyId}/batchExit`, {
      method: "POST",
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        batchCode,
        exitDate,
        quantity,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Erro ao criar saída de estoque",
      }));
      throw new Error(
        error.message || `Erro ao criar saída de estoque: ${response.statusText}`
      );
    }

    const result = await response.json();
    const detail = result.bloodDetails?.[0];
    //
    return {
      id: result.id,
      batchCode: result.batchCode,
      exitDate: result.exitDate,
      bloodType: detail?.bloodType,
      quantity: detail?.quantity,
    };
  }

/**
 * Update blood stock quantity
 */
export async function updateBloodstockQuantity(
  batchCode: string,
  quantity: number
): Promise<IBloodstock> {
  const authToken = getAuthTokenClient();

  const response = await fetch(
    `${API_BASE_URL}/${batchCode}/quantity?quantity=${quantity}`,
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
  const detail = result.bloodDetails?.[0];
  return {
      id: result.id,
      batchCode: result.batchCode,
      entryDate: result.entryDate,
      exitDate: result.exitDate,
      bloodType: detail?.bloodType,
      quantity: detail?.quantity,
      updateDate: detail?.updateDate,
      }
  };



