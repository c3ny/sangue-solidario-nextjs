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
  updateDate: string;
  companyId?: string;
}

/**
 * Request DTO for creating a new blood stock
 */
export interface ICreateBloodstockRequest {
  bloodType: string;
  quantity: number;
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
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}

/**
 * Available blood types as array
 */
export const BLOOD_TYPES: BloodType[] = [
  BloodType.A_POSITIVE,
  BloodType.A_NEGATIVE,
  BloodType.B_POSITIVE,
  BloodType.B_NEGATIVE,
  BloodType.AB_POSITIVE,
  BloodType.AB_NEGATIVE,
  BloodType.O_POSITIVE,
  BloodType.O_NEGATIVE,
];
