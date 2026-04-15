import { apiClient, isAPISuccess } from "@/service/api/api.client";
import { logger } from "@/utils/logger";
import { ICampaign, CampaignStatus } from "../interfaces/Campaign.interface";

interface PaginatedCampaigns {
  data: ICampaign[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Client-side service for PUBLIC campaign reads.
 *
 * Authenticated operations (create/update/delete/upload banner) are Server
 * Actions in `src/actions/campaigns/campaign-actions.ts` — they read the
 * HTTPOnly `token` cookie server-side. Never fetch with Bearer token from
 * the browser (the token cookie is HTTPOnly by design).
 */
export class CampaignClientService {
  async getCampaignsByInstitution(
    institutionId: string,
    limit = 6
  ): Promise<ICampaign[]> {
    try {
      const params = new URLSearchParams({
        organizerId: institutionId,
        status: CampaignStatus.ACTIVE,
        limit: String(limit),
      });
      const url = apiClient.getCampaignServiceUrl(`campaigns?${params.toString()}`);
      const response = await apiClient.get<PaginatedCampaigns>(url);

      if (isAPISuccess(response)) return response.data.data;

      logger.error("Failed to fetch institution campaigns:", response.message);
      return [];
    } catch (error) {
      logger.error("Error fetching institution campaigns:", error);
      return [];
    }
  }

  async getAllCampaignsByInstitution(
    institutionId: string,
    limit = 50
  ): Promise<ICampaign[]> {
    try {
      const params = new URLSearchParams({
        organizerId: institutionId,
        limit: String(limit),
      });
      const url = apiClient.getCampaignServiceUrl(`campaigns?${params.toString()}`);
      const response = await apiClient.get<PaginatedCampaigns>(url);

      if (isAPISuccess(response)) return response.data.data;

      logger.error("Failed to fetch all institution campaigns:", response.message);
      return [];
    } catch (error) {
      logger.error("Error fetching all institution campaigns:", error);
      return [];
    }
  }
}

export const campaignClientService = new CampaignClientService();
