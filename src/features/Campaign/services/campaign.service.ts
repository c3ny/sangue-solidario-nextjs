import { ICampaign, CampaignStatus } from "../interfaces/Campaign.interface";
import { getServerUrl } from "@/config/microservices";
import { logger } from "@/utils/logger";

interface ListCampaignsOptions {
  status?: CampaignStatus;
  organizerId?: string;
  bloodType?: string;
  page?: number;
  limit?: number;
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
  limit = 12
): Promise<ICampaign[]> {
  try {
    const result = await fetchCampaigns({
      status: CampaignStatus.ACTIVE,
      limit: String(limit),
    });
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

  try {
    return await fetchCampaigns(params);
  } catch (error) {
    logger.error("listCampaigns failed:", error);
    return { data: [], total: 0, page: 1, limit: options.limit ?? 12 };
  }
}
