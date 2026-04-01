/**
 * lib/api.ts
 *
 * Funções de acesso à API.
 * Bloodstock: companyId vem do JWT token (não mais na URL).
 * Todos os endpoints requerem Authorization: Bearer <token>.
 */

import { getClientUrl } from "@/config/microservices";
import { getAuthTokenClient } from "@/utils/auth.client";
import {
  IAppointment,
  AppointmentStatus,
} from "@/features/Institution/interfaces/Appointment.interface";
import {
  ICampaign,
  
} from "@/features/Campaign/interfaces/Campaign.interface";

const BLOOD_STOCK_API = `${getClientUrl("bloodStock", "api/stock")}`;
const USERS_API = `${getClientUrl("users", "")}`;

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Resposta padrão de estoque (GET /api/stock, POST /batchEntry, POST /batchExit) */
export interface BloodstockItem {
  id: string;
  bloodType: string; // camelCase — vem assim do back novo
  quantity: number;
}

/** Empresa vinculada ao usuário — vem do user-service */
export interface Company {
  id: string;
  cnpj: string;
  institutionName: string;
  cnes: string;
  fkUserId: string;
}

/** Body para entrada de lote — POST /api/stock/batchEntry */
export interface BatchEntryRequest {
  batchCode: string;
  /** Formato DD/MM/YYYY */
  entryDate: string;
  /** Formato DD/MM/YYYY */
  expiryDate: string;
  /** Ex: { "A+": 10, "O-": 5 } */
  bloodQuantities: Partial<Record<string, number>>;
}

/** Body para saída de estoque — POST /api/stock/batchExit */
export interface BatchExitRequest {
  /** Formato DD/MM/YYYY */
  exitDate: string;
  /** Ex: { "A+": 3 } */
  quantities: Partial<Record<string, number>>;
}

/** Entidade de movimentação retornada por GET /api/stock/history */
export interface BloodstockMovement {
  id: string;
  bloodstock: {
    id: string;
    bloodType: string;
    quantity: number;
  };
  batch?: {
    id: string;
    batchCode: string;
  };
  movement: number;
  quantityBefore: number;
  quantityAfter: number;
  actionBy: string;
  actionDate: string;
  notes?: string;
}

/** Lote disponível por tipo sanguíneo — GET /api/stock/batches/:bloodType */
export interface AvailableBatch {
  id: string;
  quantity: number;
  expiryDate: string;
  batch: {
    id: string;
    batchCode: string;
    entryDate: string;
  };
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

function authHeaders(): Record<string, string> {
  const token = getAuthTokenClient();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Erro ${response.status}: ${response.statusText}`
    );
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// User-service
// ---------------------------------------------------------------------------

/**
 * Busca a empresa vinculada ao usuário.
 * GET /users/:userId/company
 */
export async function getCompanyByUserId(userId: string): Promise<Company> {
  const token = getAuthTokenClient();

  const response = await fetch(`${USERS_API}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404)
      throw new Error("Empresa não encontrada para este usuário");
    if (response.status === 401)
      throw new Error("Não autenticado. Por favor, faça login novamente.");
    if (response.status === 403)
      throw new Error("Você não tem permissão para acessar estes dados.");
    throw new Error(`Erro ao buscar dados da empresa: ${response.statusText}`);
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Bloodstock — estoque atual
// ---------------------------------------------------------------------------

/**
 * Lista o estoque atual da empresa autenticada.
 * GET /api/stock
 * companyId extraído do JWT no back-end.
 */
export async function getStock(): Promise<BloodstockItem[]> {
  const response = await fetch(BLOOD_STOCK_API, {
    headers: authHeaders(),
  });
  return handleResponse<BloodstockItem[]>(response);
}

// ---------------------------------------------------------------------------
// Bloodstock — entrada de lote
// ---------------------------------------------------------------------------

/**
 * Registra entrada de um lote de sangue.
 * POST /api/stock/batchEntry
 * Retorna o estoque atualizado da empresa.
 */
export async function batchEntry(
  dto: BatchEntryRequest
): Promise<BloodstockItem[]> {
  const response = await fetch(`${BLOOD_STOCK_API}/batchEntry`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(dto),
  });
  return handleResponse<BloodstockItem[]>(response);
}

// ---------------------------------------------------------------------------
// Bloodstock — saída de estoque (FEFO)
// ---------------------------------------------------------------------------

/**
 * Registra saída de estoque aplicando regra FEFO.
 * POST /api/stock/batchExit
 * Retorna o estoque atualizado da empresa.
 */
export async function batchExit(
  dto: BatchExitRequest
): Promise<BloodstockItem[]> {
  const response = await fetch(`${BLOOD_STOCK_API}/batchExit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(dto),
  });
  return handleResponse<BloodstockItem[]>(response);
}

// ---------------------------------------------------------------------------
// Bloodstock — lotes disponíveis por tipo sanguíneo
// ---------------------------------------------------------------------------

/**
 * Lista lotes disponíveis para um tipo sanguíneo específico (ordenados por FEFO).
 * GET /api/stock/batches/:bloodType
 */
export async function getAvailableBatches(
  bloodType: string
): Promise<AvailableBatch[]> {
  const response = await fetch(
    `${BLOOD_STOCK_API}/batches/${encodeURIComponent(bloodType)}`,
    { headers: authHeaders() }
  );
  return handleResponse<AvailableBatch[]>(response);
}

// ---------------------------------------------------------------------------
// Bloodstock — histórico de movimentações
// ---------------------------------------------------------------------------

/**
 * Retorna o histórico de movimentações da empresa autenticada.
 * GET /api/stock/history
 */
export async function getStockHistory(): Promise<BloodstockMovement[]> {
  const response = await fetch(`${BLOOD_STOCK_API}/history`, {
    headers: authHeaders(),
  });

  if (response.status === 404) return [];

  return handleResponse<BloodstockMovement[]>(response);
}

// ---------------------------------------------------------------------------
// Bloodstock — relatório CSV
// ---------------------------------------------------------------------------

/**
 * Faz download do relatório CSV do estoque.
 * GET /api/stock/report
 */
export async function generateStockReport(): Promise<void> {
  const response = await fetch(`${BLOOD_STOCK_API}/report`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erro ao gerar relatório: ${response.statusText}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `estoque-report-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Agendamentos — mock (substituir quando API estiver pronta)
// ---------------------------------------------------------------------------

export async function getAppointmentsByCompany(
  institutionId: string
): Promise<IAppointment[]> {
  // TODO: substituir pelo endpoint real quando disponível
  // GET /api/appointments/institution/:institutionId
  void institutionId;
  return Promise.resolve([]);
}

// ---------------------------------------------------------------------------
// Campanhas — mock (substituir quando API estiver pronta)
// ---------------------------------------------------------------------------

export async function getAllCampaigns(): Promise<ICampaign[]> {
  // TODO: substituir pelo endpoint real quando disponível
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 500);
  });
}