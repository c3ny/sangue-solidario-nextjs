"use server";

import { getServerUrl } from "@/config/microservices";
import { getAuthToken } from "@/utils/auth";
import { IBatchEntryRequest, IBatchExitRequest, IBloodstockItem, IBloodstockMovement, IAvailableBatch } from "@/features/BloodStock/interfaces/Bloodstock.interface";
import { Company } from "@/lib/api";
import { getCurrentUser } from "@/utils/auth";

// ---------------------------------------------------------------------------
// Helper interno
// ---------------------------------------------------------------------------

async function serverAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erro ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

const BLOOD_STOCK_API = getServerUrl("bloodStock", "api/stock");

// ---------------------------------------------------------------------------
// User-service
// ---------------------------------------------------------------------------

/**
 * Retorna os dados da empresa a partir do cookie "user" (já disponível no servidor).
 * Evita uma chamada extra ao user-service — os dados vêm do login.
 */
export async function getCompanyAction(): Promise<Company> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Não autenticado. Por favor, faça login novamente.");
  }

  return {
    id: (user as any).companyId ?? user.id,
    cnpj: (user as any).cnpj ?? "",
    institutionName: (user as any).institutionName ?? user.name ?? "",
    cnes: (user as any).cnes ?? "",
    fkUserId: user.id,
  };
}

// ---------------------------------------------------------------------------
// Estoque atual
// ---------------------------------------------------------------------------

/**
 * Lista o estoque agregado da empresa autenticada.
 * GET /api/stock
 */
export async function getStockAction(): Promise<IBloodstockItem[]> {
  const headers = await serverAuthHeaders();
  const res = await fetch(BLOOD_STOCK_API, { headers });
  return handleResponse<IBloodstockItem[]>(res);
}

// ---------------------------------------------------------------------------
// Histórico de movimentações
// ---------------------------------------------------------------------------

/**
 * Retorna o histórico de movimentações da empresa autenticada.
 * GET /api/stock/history
 */
export async function getStockHistoryAction(): Promise<IBloodstockMovement[]> {
  const headers = await serverAuthHeaders();
  const res = await fetch(`${BLOOD_STOCK_API}/history`, { headers });
  if (res.status === 404) return [];
  return handleResponse<IBloodstockMovement[]>(res);
}

// ---------------------------------------------------------------------------
// Lotes disponíveis por tipo sanguíneo
// ---------------------------------------------------------------------------

/**
 * Lista lotes disponíveis para um tipo sanguíneo, ordenados por vencimento (FEFO).
 * GET /api/stock/batches/:bloodType
 */
export async function getAvailableBatchesAction(
  bloodType: string
): Promise<IAvailableBatch[]> {
  const headers = await serverAuthHeaders();
  const res = await fetch(
    `${BLOOD_STOCK_API}/batches/${encodeURIComponent(bloodType)}`,
    { headers }
  );
  if (res.status === 404) return [];
  return handleResponse<IAvailableBatch[]>(res);
}



/**
 * Registra entrada de um lote de sangue.
 * POST /api/stock/batchEntry
 */
export async function batchEntryAction(
  dto: IBatchEntryRequest
): Promise<IBloodstockItem[]> {
  const headers = await serverAuthHeaders();
  const res = await fetch(`${BLOOD_STOCK_API}/batchEntry`, {
    method: "POST",
    headers,
    body: JSON.stringify(dto),
  });
  return handleResponse<IBloodstockItem[]>(res);
}

// ---------------------------------------------------------------------------
// Saída de estoque (FEFO)
// ---------------------------------------------------------------------------

/**
 * Registra saída de estoque aplicando regra FEFO.
 * POST /api/stock/batchExit
 */
export async function batchExitAction(
  dto: IBatchExitRequest
): Promise<IBloodstockItem[]> {
  const headers = await serverAuthHeaders();
  const res = await fetch(`${BLOOD_STOCK_API}/batchExit`, {
    method: "POST",
    headers,
    body: JSON.stringify(dto),
  });
  return handleResponse<IBloodstockItem[]>(res);
}