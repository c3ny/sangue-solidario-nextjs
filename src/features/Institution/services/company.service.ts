import { APIService, isAPISuccess } from "@/service/api/api";
import { IInstitution } from "../interfaces/Institution.interface";
import {
  IInstitutionCard,
  PaginatedInstitutionCards,
} from "../interfaces/InstitutionCard.interface";
import {
  CompanyApiResponse,
  companyToInstitution,
} from "../mappers/company-to-institution.mapper";
import { UpdateCompanyInput } from "../schemas/update-company.schema";
import { logger } from "@/utils/logger";

const apiService = new APIService();

/**
 * Fetch a company's public profile by slug.
 * No auth required. Maps backend CompanyPublicResponseDto → IInstitution.
 */
export async function getCompanyBySlug(
  slug: string
): Promise<IInstitution | null> {
  try {
    const url = apiService.getUsersServiceUrl(`companies/${slug}`);
    const response = await apiService.get<CompanyApiResponse>(url);

    if (!isAPISuccess(response)) {
      return null;
    }

    return companyToInstitution(response.data);
  } catch (error) {
    logger.error("getCompanyBySlug error:", error);
    return null;
  }
}

/**
 * Fetch the authenticated company's own profile.
 * Requires a valid JWT token from a COMPANY user.
 */
export async function getMyCompany(token: string): Promise<IInstitution | null> {
  try {
    const url = apiService.getUsersServiceUrl("companies/me");
    const response = await apiService.get<CompanyApiResponse>(url, { token });

    if (!isAPISuccess(response)) {
      return null;
    }

    return companyToInstitution(response.data);
  } catch (error) {
    logger.error("getMyCompany error:", error);
    return null;
  }
}

/**
 * Update the authenticated company's public profile fields.
 */
export async function updateMyCompany(
  patch: UpdateCompanyInput,
  token: string
): Promise<IInstitution> {
  const url = apiService.getUsersServiceUrl("companies/me");
  const response = await apiService.patch<CompanyApiResponse>(url, patch, {
    token,
  });

  if (!isAPISuccess(response)) {
    const msg = (response as { message?: string | string[] }).message;
    throw new Error(
      Array.isArray(msg) ? msg.join(", ") : (msg ?? "Erro ao atualizar perfil")
    );
  }

  return companyToInstitution(response.data);
}

/**
 * Update the banner (cover) image URL of the company.
 * The URL must have been obtained from the CDN service first.
 */
export async function updateMyCompanyBanner(
  imageUrl: string,
  token: string
): Promise<IInstitution> {
  const url = apiService.getUsersServiceUrl("companies/me/banner");
  const response = await apiService.patch<CompanyApiResponse>(
    url,
    { imageUrl },
    { token }
  );

  if (!isAPISuccess(response)) {
    throw new Error(
      (response as { message?: string }).message ?? "Erro ao atualizar banner"
    );
  }

  return companyToInstitution(response.data);
}

/**
 * Update the logo (profile photo) image URL of the company.
 */
export async function updateMyCompanyLogo(
  imageUrl: string,
  token: string
): Promise<IInstitution> {
  const url = apiService.getUsersServiceUrl("companies/me/logo");
  const response = await apiService.patch<CompanyApiResponse>(
    url,
    { imageUrl },
    { token }
  );

  if (!isAPISuccess(response)) {
    throw new Error(
      (response as { message?: string }).message ?? "Erro ao atualizar logo"
    );
  }

  return companyToInstitution(response.data);
}

/**
 * List active companies (hemocentros) with pagination.
 * Public endpoint — no auth required.
 */
export async function listActiveCompanies(params?: {
  page?: number;
  limit?: number;
  city?: string;
  uf?: string;
}): Promise<PaginatedInstitutionCards> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.city) searchParams.set("city", params.city);
    if (params?.uf) searchParams.set("uf", params.uf);

    const query = searchParams.toString();
    const url = apiService.getUsersServiceUrl(`companies${query ? `?${query}` : ""}`);

    const response = await apiService.get<{
      data: CompanyApiResponse[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(url);

    if (!isAPISuccess(response)) {
      return { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };
    }

    const cards: IInstitutionCard[] = response.data.data.map((c) => ({
      id: c.id,
      slug: c.slug,
      institutionName: c.institutionName,
      type: c.type,
      logoImage: c.logoImage,
      city: c.city,
      uf: c.uf,
      acceptsDonations: c.acceptsDonations,
      acceptsScheduling: c.acceptsScheduling,
    }));

    return { data: cards, meta: response.data.meta };
  } catch (error) {
    logger.error("listActiveCompanies error:", error);
    return { data: [], meta: { total: 0, page: 1, limit: 12, totalPages: 0 } };
  }
}
