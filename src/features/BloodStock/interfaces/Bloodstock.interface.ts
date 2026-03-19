/**
 * features/BloodStock/interfaces/Bloodstock.interface.ts
 *
 * Interfaces alinhadas com o contrato atual do bloodstock-service.
 */

// ---------------------------------------------------------------------------
// Enum e constantes
// ---------------------------------------------------------------------------

export enum BloodType {
  A_POS  = "A+",
  A_NEG  = "A-",
  B_POS  = "B+",
  B_NEG  = "B-",
  AB_POS = "AB+",
  AB_NEG = "AB-",
  O_POS  = "O+",
  O_NEG  = "O-",
}

export const BLOOD_TYPES = Object.values(BloodType);

// ---------------------------------------------------------------------------
// Response DTOs (o que vem da API)
// ---------------------------------------------------------------------------

/**
 * Estoque agregado por tipo sanguíneo.
 * Retornado por: GET /api/stock | POST /batchEntry | POST /batchExit
 */
export interface IBloodstockItem {
  id: string;
  bloodType: BloodType | string;
  quantity: number;
}

/**
 * Movimentação individual registrada no histórico.
 * Retornado por: GET /api/stock/history
 */
export interface IBloodstockMovement {
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
  movement: number;      // positivo = entrada, negativo = saída
  quantityBefore: number;
  quantityAfter: number;
  actionBy: string;
  actionDate: string;    // ISO string
  notes?: string;
}

/**
 * Lote disponível por tipo sanguíneo.
 * Retornado por: GET /api/stock/batches/:bloodType
 */
export interface IAvailableBatch {
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
// Request DTOs (o que enviamos para a API)
// ---------------------------------------------------------------------------

/**
 * Entrada de lote de sangue.
 * POST /api/stock/batchEntry
 */
export interface IBatchEntryRequest {
  batchCode: string;
  /** Formato DD/MM/YYYY */
  entryDate: string;
  /** Formato DD/MM/YYYY */
  expiryDate: string;
  /** Quantidades por tipo sanguíneo. Ex: { "A+": 10, "O-": 5 } */
  bloodQuantities: Partial<Record<BloodType | string, number>>;
}

/**
 * Saída de estoque (aplica FEFO no back-end).
 * POST /api/stock/batchExit
 */
export interface IBatchExitRequest {
  /** Formato DD/MM/YYYY */
  exitDate: string;
  /** Quantidades por tipo sanguíneo. Ex: { "A+": 3 } */
  quantities: Partial<Record<BloodType | string, number>>;
}