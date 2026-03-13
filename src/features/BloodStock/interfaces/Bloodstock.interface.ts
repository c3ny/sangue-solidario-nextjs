/**
 * Blood Stock Interfaces
 * TypeScript interfaces for blood stock management
 */

/**
 * Blood stock item
 */
export interface IBloodstock {
  id: string;
  bloodType: string;
  quantity: number;
  updateDate?: string;
  companyId?: string;
  batchCode?: string;
  entryDate?: string;
  exitDate?: string;
}

/**
 * Request DTO for creating blood stock with company
 */
export interface ICreateBloodstockWithCompanyRequest {
  bloodType: string;
  quantity: number;
  companyId: string;
}

/**
 * Response from blood stock creation
 */
export interface ICreateBloodstockResponse {
  id: string;
  bloodType: string;
  quantity: number;
  updateDate: string;
}

/**
 * Blood type enum
 */
export enum BloodType {
  A_POS = "A+",
  A_NEG = "A-",
  B_POS = "B+",
  B_NEG = "B-",
  AB_POS = "AB+",
  AB_NEG = "AB-",
  O_POS = "O+",
  O_NEG = "O-",
}

/**
 * Available blood types as array
 */
export const BLOOD_TYPES: BloodType[] = [
  BloodType.A_POS,
  BloodType.A_NEG,
  BloodType.B_POS,
  BloodType.B_NEG,
  BloodType.AB_POS,
  BloodType.AB_NEG,
  BloodType.O_POS,
  BloodType.O_NEG,
];
