/**
 * Input mask utilities for Brazilian documents and formats
 */

/**
 * Mask for CPF (000.000.000-00)
 */
export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

/**
 * Remove CPF mask (returns only numbers)
 */
export function unmaskCPF(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Mask for CNPJ (00.000.000/0000-00)
 */
export function maskCNPJ(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

/**
 * Remove CNPJ mask (returns only numbers)
 */
export function unmaskCNPJ(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Mask for Date (DD/MM/YYYY)
 */
export function maskDate(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4})\d+?$/, "$1");
}

/**
 * Remove date mask (returns only numbers)
 */
export function unmaskDate(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Mask for CEP (00000-000)
 */
export function maskCEP(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
}

/**
 * Remove CEP mask (returns only numbers)
 */
export function unmaskCEP(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Mask for CNES (0000000 - 7 digits)
 */
export function maskCNES(value: string): string {
  return value.replace(/\D/g, "").substring(0, 7);
}

/**
 * Remove CNES mask (returns only numbers)
 */
export function unmaskCNES(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Generic function to apply mask on input change
 */
export function applyMask(
  value: string,
  maskFn: (value: string) => string
): string {
  return maskFn(value);
}

/**
 * Validate if date is in correct format (DD/MM/YYYY)
 */
export function isValidDateFormat(date: string): boolean {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(date);
}

/**
 * Validate if CPF format is correct (000.000.000-00)
 */
export function isValidCPFFormat(cpf: string): boolean {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(cpf);
}

/**
 * Validate if CNPJ format is correct (00.000.000/0000-00)
 */
export function isValidCNPJFormat(cnpj: string): boolean {
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return regex.test(cnpj);
}
