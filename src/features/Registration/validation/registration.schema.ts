import * as Yup from "yup";
import { PersonType } from "@/interfaces/Registration.interface";

/**
 * Common validation rules
 */
const commonSchema = {
  name: Yup.string()
    .required("Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: Yup.string().required("E-mail é obrigatório").email("E-mail inválido"),
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
  city: Yup.string().required("Cidade é obrigatória"),
  uf: Yup.string()
    .required("Estado é obrigatório")
    .length(2, "Estado deve ter 2 caracteres"),
  zipcode: Yup.string()
    .required("CEP é obrigatório")
    .matches(/^\d{8}$/, "CEP deve conter 8 dígitos (apenas números)"),
};

/**
 * CPF validation
 */
const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

/**
 * CNPJ validation
 */
const validateCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]/g, "");

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
};

/**
 * Donor (Pessoa Física) validation schema
 */
export const donorValidationSchema = Yup.object().shape({
  ...commonSchema,
  personType: Yup.string()
    .required("Tipo de pessoa é obrigatório")
    .oneOf([PersonType.DONOR], "Tipo de pessoa inválido"),
  cpf: Yup.string()
    .required("CPF é obrigatório")
    .test("valid-cpf", "CPF inválido", (value) => {
      if (!value) return false;
      return validateCPF(value);
    }),
  bloodType: Yup.string()
    .required("Tipo sanguíneo é obrigatório")
    .oneOf(
      ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      "Tipo sanguíneo inválido"
    ),
  birthDate: Yup.string()
    .required("Data de nascimento é obrigatória")
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data deve estar no formato DD/MM/AAAA"
    ),
});

/**
 * Company (Pessoa Jurídica) validation schema
 */
export const companyValidationSchema = Yup.object().shape({
  ...commonSchema,
  personType: Yup.string()
    .required("Tipo de pessoa é obrigatório")
    .oneOf([PersonType.COMPANY], "Tipo de pessoa inválido"),
  cnpj: Yup.string()
    .required("CNPJ é obrigatório")
    .test("valid-cnpj", "CNPJ inválido", (value) => {
      if (!value) return false;
      return validateCNPJ(value);
    }),
  institutionName: Yup.string()
    .required("Nome da instituição é obrigatório")
    .min(3, "Nome da instituição deve ter pelo menos 3 caracteres"),
  cnes: Yup.string()
    .required("CNES é obrigatório")
    .matches(/^\d{7}$/, "CNES deve conter 7 dígitos"),
});

/**
 * Get validation schema based on person type
 */
export const getValidationSchema = (personType: PersonType | "") => {
  if (personType === PersonType.DONOR) {
    return donorValidationSchema;
  }
  if (personType === PersonType.COMPANY) {
    return companyValidationSchema;
  }
  return Yup.object().shape({});
};
