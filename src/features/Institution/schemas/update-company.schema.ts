import * as Yup from "yup";

const scheduleItemSchema = Yup.object({
  dayOfWeek: Yup.string()
    .oneOf(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"])
    .required(),
  openTime: Yup.string()
    .matches(/^\d{2}:\d{2}$/, "Formato inválido (use HH:MM)")
    .required(),
  closeTime: Yup.string()
    .matches(/^\d{2}:\d{2}$/, "Formato inválido (use HH:MM)")
    .required(),
  isOpen: Yup.boolean().required(),
});

export const updateCompanyValidationSchema = Yup.object({
  type: Yup.string()
    .oneOf(["HOSPITAL", "BLOOD_CENTER", "CLINIC"])
    .optional(),

  description: Yup.string()
    .max(2000, "Descrição deve ter no máximo 2000 caracteres")
    .optional(),

  phone: Yup.string()
    .matches(/^(\d{10,11})?$/, "Telefone deve conter 10 ou 11 dígitos")
    .optional(),

  whatsapp: Yup.string()
    .matches(/^(\d{10,11})?$/, "WhatsApp deve conter 10 ou 11 dígitos")
    .optional(),

  contactEmail: Yup.string().email("E-mail inválido").optional(),

  website: Yup.string().url("URL inválida").optional(),

  address: Yup.string().max(255).optional(),
  neighborhood: Yup.string().max(100).optional(),
  city: Yup.string().max(100).optional(),

  uf: Yup.string()
    .length(2, "UF deve ter exatamente 2 caracteres")
    .optional(),

  zipcode: Yup.string()
    .matches(/^(\d{8})?$/, "CEP deve ter exatamente 8 dígitos")
    .optional(),

  latitude: Yup.number().min(-90).max(90).optional(),
  longitude: Yup.number().min(-180).max(180).optional(),

  schedule: Yup.array(scheduleItemSchema).length(7).optional(),

  acceptsDonations: Yup.boolean().optional(),
  acceptsScheduling: Yup.boolean().optional(),
});

export type UpdateCompanyInput = Yup.InferType<typeof updateCompanyValidationSchema>;
