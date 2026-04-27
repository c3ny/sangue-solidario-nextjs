import {
  IInstitution,
  IInstitutionSchedule,
  InstitutionStatus,
  InstitutionType,
} from "../interfaces/Institution.interface";

/** Shape returned by GET /companies/:slug and GET /companies/me */
export interface CompanyApiResponse {
  id: string;
  slug: string;
  institutionName: string;
  cnpj: string;
  cnes: string;
  type?: string;
  status?: string;
  description?: string;
  bannerImage?: string;
  logoImage?: string;
  phone?: string;
  whatsapp?: string;
  contactEmail?: string;
  website?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  uf?: string;
  zipcode?: string;
  latitude?: number;
  longitude?: number;
  schedule?: Array<{
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }>;
  acceptsDonations: boolean;
  acceptsScheduling: boolean;
}

const DAY_OF_WEEK_MAP: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

function mapSchedule(
  schedule: CompanyApiResponse["schedule"]
): IInstitutionSchedule[] {
  if (!schedule) return [];
  return schedule.map((s) => ({
    dayOfWeek: DAY_OF_WEEK_MAP[s.dayOfWeek] ?? s.dayOfWeek,
    openTime: s.openTime,
    closeTime: s.closeTime,
    isOpen: s.isOpen,
  }));
}

export function companyToInstitution(company: CompanyApiResponse): IInstitution {
  return {
    id: company.id,
    username: company.slug,
    institutionName: company.institutionName,
    cnpj: company.cnpj,
    cnes: company.cnes,
    type: (company.type as InstitutionType) ?? InstitutionType.BLOOD_CENTER,
    status: (company.status as InstitutionStatus) ?? InstitutionStatus.ACTIVE,
    description: company.description,
    bannerImage: company.bannerImage,
    logoImage: company.logoImage,
    location: {
      address: company.address ?? "",
      city: company.city ?? "",
      uf: company.uf ?? "",
      zipcode: company.zipcode,
      latitude: company.latitude,
      longitude: company.longitude,
      neighborhood: company.neighborhood,
    },
    contact: {
      phone: company.phone ?? "",
      email: company.contactEmail ?? "",
      website: company.website,
      whatsapp: company.whatsapp,
    },
    schedule: mapSchedule(company.schedule),
    acceptsDonations: company.acceptsDonations,
    acceptsScheduling: company.acceptsScheduling,
    userId: "",
    createdAt: "",
    updatedAt: "",
  };
}
