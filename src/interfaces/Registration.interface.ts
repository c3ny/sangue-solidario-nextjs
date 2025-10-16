/**
 * Person type enum
 */
export enum PersonType {
  DONOR = "DONOR",
  COMPANY = "COMPANY",
}

/**
 * Base registration data shared between person and company
 */
export interface IBaseRegistration {
  name: string;
  email: string;
  password: string;
  city: string;
  uf: string;
  zipcode: string;
  personType: PersonType;
}

/**
 * Donor (Pessoa Física) registration data
 */
export interface IDonorRegistration extends IBaseRegistration {
  personType: PersonType.DONOR;
  cpf: string;
  bloodType: string;
  birthDate: string; // Format: DD/MM/YYYY
}

/**
 * Company (Pessoa Jurídica) registration data
 */
export interface ICompanyRegistration extends IBaseRegistration {
  personType: PersonType.COMPANY;
  cnpj: string;
  institutionName: string;
  cnes: string;
}

/**
 * Registration request type (discriminated union)
 */
export type IRegistrationRequest = IDonorRegistration | ICompanyRegistration;

/**
 * Registration response from API
 */
export interface IRegistrationResponse {
  id: number;
  name: string;
  email: string;
  personType: PersonType;
  message?: string;
}
