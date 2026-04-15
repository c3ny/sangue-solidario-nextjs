import { ICampaign, CampaignStatus } from "../interfaces/Campaign.interface";
import { getServerUrl } from "@/config/microservices";
import { logger } from "@/utils/logger";

export type CampaignSort = "startDate" | "createdAt";

interface ListCampaignsOptions {
  status?: CampaignStatus;
  organizerId?: string;
  bloodType?: string;
  page?: number;
  limit?: number;
  sort?: CampaignSort;
}

interface PaginatedCampaigns {
  data: ICampaign[];
  total: number;
  page: number;
  limit: number;
}

async function fetchCampaigns(
  params: Record<string, string>
): Promise<PaginatedCampaigns> {
  const query = new URLSearchParams(params).toString();
  const url = getServerUrl("campaign", `/campaigns?${query}`);

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`campaign-service error: ${res.status}`);
  }

  return res.json() as Promise<PaginatedCampaigns>;
}

export async function listActiveCampaigns(
  opts: { limit?: number; sort?: CampaignSort } | number = {}
): Promise<ICampaign[]> {
  const { limit = 12, sort } =
    typeof opts === "number" ? { limit: opts, sort: undefined } : opts;

  try {
    const params: Record<string, string> = {
      status: CampaignStatus.ACTIVE,
      limit: String(limit),
    };
    if (sort) params.sort = sort;

    const result = await fetchCampaigns(params);
    return result.data;
  } catch (error) {
    logger.error("listActiveCampaigns failed:", error);
    return [];
  }
}

export async function getCampaignsByInstitution(
  institutionId: string,
  limit = 6
): Promise<ICampaign[]> {
  try {
    const result = await fetchCampaigns({
      organizerId: institutionId,
      status: CampaignStatus.ACTIVE,
      limit: String(limit),
    });
    return result.data;
  } catch (error) {
    logger.error("getCampaignsByInstitution failed:", error);
    return [];
  }
}

export async function getCampaignById(id: string): Promise<ICampaign | null> {
  try {
    const url = getServerUrl("campaign", `/campaigns/${id}`);
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`campaign-service error: ${res.status}`);

    return res.json() as Promise<ICampaign>;
  } catch (error) {
    logger.error("getCampaignById failed:", error);
    return null;
  }
}

export async function listCampaigns(
  options: ListCampaignsOptions = {}
): Promise<PaginatedCampaigns> {
  const params: Record<string, string> = {};
  if (options.status) params.status = options.status;
  if (options.organizerId) params.organizerId = options.organizerId;
  if (options.bloodType) params.bloodType = options.bloodType;
  if (options.page) params.page = String(options.page);
  if (options.limit) params.limit = String(options.limit);
  if (options.sort) params.sort = options.sort;

  try {
    return await fetchCampaigns(params);
  } catch (error) {
    logger.error("listCampaigns failed:", error);
    return { data: [], total: 0, page: 1, limit: options.limit ?? 12 };
  }
}
