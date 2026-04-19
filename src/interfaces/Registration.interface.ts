/**
 * Person type enum
 */
export enum PersonType {
  DONOR = "DONOR",
  COMPANY = "COMPANY",
}

/**
 * Sexo biologico do doador. Define o intervalo minimo entre doacoes
 * (MALE 60 dias, FEMALE 90 dias — regra Anvisa).
 */
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

/**
 * Base registration data shared between person and company
 */
export interface IBaseRegistration {
  name: string;
  email: string;
  password: string;
  phone: string;
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
  gender: Gender;
  /**
   * Ultima doacao no formato YYYY-MM-DD (dia 01 por convencao, ja que
   * coletamos apenas mes/ano). null significa "nunca doei".
   */
  lastDonationDate: string | null;
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
