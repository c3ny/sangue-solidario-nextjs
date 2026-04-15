/**
 * lib/api.ts
 *
 * Shared DTO/type definitions used by Server Actions, hooks, and components.
 *
 * Authenticated operations (bloodstock CRUD, user/company lookups) live in
 * Server Actions under `src/actions/**` — they read the HTTPOnly `token`
 * cookie via `getAuthToken()` from `@/utils/auth` and call microservices
 * server-side. Do not add `fetch` helpers with client-side auth here — the
 * token cookie is HTTPOnly and unreachable from the browser by design.
 */

import {
  IAppointment,
} from "@/features/Institution/interfaces/Appointment.interface";
import { ICampaign } from "@/features/Campaign/interfaces/Campaign.interface";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Resposta padrão de estoque (GET /api/stock, POST /batchEntry, POST /batchExit) */
export interface BloodstockItem {
  id: string;
  bloodType: string;
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
  };
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
