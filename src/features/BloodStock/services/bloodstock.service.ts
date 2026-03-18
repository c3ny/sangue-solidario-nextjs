/**
 * features/BloodStock/services/bloodstock.service.ts
 *
 * Serviço cliente para o bloodstock-service.
 * Todos os endpoints extraem companyId do JWT — não precisa passar na URL.
 */

import { getClientUrl } from "@/config/microservices";
import { getAuthTokenClient } from "@/utils/auth.client";
import {
  IBloodstockItem,
  IBloodstockMovement,
  IAvailableBatch,
  IBatchEntryRequest,
  IBatchExitRequest,
} from "../interfaces/Bloodstock.interface";

const BASE = getClientUrl("bloodStock", "api/stock");

// ---------------------------------------------------------------------------
// Helper interno
// ---------------------------------------------------------------------------

function authHeaders(): Record<string, string> {
  const token = getAuthTokenClient();
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

// ---------------------------------------------------------------------------
// Estoque atual
// ---------------------------------------------------------------------------

/**
 * Lista o estoque agregado da empresa autenticada.
 * GET /api/stock
 */
export async function getStock(): Promise<IBloodstockItem[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  return handleResponse<IBloodstockItem[]>(res);
}

// ---------------------------------------------------------------------------
// Entrada de lote
// ---------------------------------------------------------------------------

/**
 * Registra entrada de um lote de sangue.
 * POST /api/stock/batchEntry
 * Retorna o estoque atualizado.
 */
export async function processBatchEntry(
  dto: IBatchEntryRequest
): Promise<IBloodstockItem[]> {
  const res = await fetch(`${BASE}/batchEntry`, {
    method: "POST",
    headers: authHeaders(),
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
 * Retorna o estoque atualizado.
 */
export async function processBatchExit(
  dto: IBatchExitRequest
): Promise<IBloodstockItem[]> {
  const res = await fetch(`${BASE}/batchExit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(dto),
  });
  return handleResponse<IBloodstockItem[]>(res);
}

// ---------------------------------------------------------------------------
// Lotes disponíveis por tipo sanguíneo
// ---------------------------------------------------------------------------

/**
 * Lista lotes disponíveis ordenados por vencimento (FEFO).
 * GET /api/stock/batches/:bloodType
 */
export async function getAvailableBatches(
  bloodType: string
): Promise<IAvailableBatch[]> {
  const res = await fetch(
    `${BASE}/batches/${encodeURIComponent(bloodType)}`,
    { headers: authHeaders() }
  );
  return handleResponse<IAvailableBatch[]>(res);
}

// ---------------------------------------------------------------------------
// Histórico de movimentações
// ---------------------------------------------------------------------------

/**
 * Retorna o histórico de movimentações da empresa autenticada.
 * GET /api/stock/history
 */
export async function getStockHistory(): Promise<IBloodstockMovement[]> {
  const res = await fetch(`${BASE}/history`, { headers: authHeaders() });
  if (res.status === 404) return [];
  return handleResponse<IBloodstockMovement[]>(res);
}

// ---------------------------------------------------------------------------
// Relatório CSV
// ---------------------------------------------------------------------------

/**
 * Faz download do relatório CSV do estoque.
 * GET /api/stock/report
 */
export async function downloadStockReport(): Promise<void> {
  const res = await fetch(`${BASE}/report`, { headers: authHeaders() });

  if (!res.ok) {
    throw new Error(`Erro ao gerar relatório: ${res.statusText}`);
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `estoque-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}