import { apiClient, isAPISuccess } from "@/service/api/api.client";
import { getAuthTokenClient } from "@/utils/auth.client";
import { logger } from "@/utils/logger";
import { ICampaign, ICampaignLocation, CampaignStatus } from "../interfaces/Campaign.interface";

interface PaginatedCampaigns {
  data: ICampaign[];
  total: number;
  page: number;
  limit: number;
}

export interface ICreateCampaignData {
  title: string;
  description: string;
  bannerImage?: string;
  startDate: string;
  endDate: string;
  bloodType?: string;
  location: ICampaignLocation;
  organizerId: string;
  organizerName: string;
  organizerUsername?: string;
  targetDonations?: number;
}

export type IUpdateCampaignData = Partial<
  Omit<ICreateCampaignData, "organizerId" | "organizerName" | "organizerUsername">
>;

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

  async createCampaign(data: ICreateCampaignData): Promise<ICampaign | null> {
    try {
      const token = getAuthTokenClient();
      if (!token) {
        logger.error("No authentication token available");
        return null;
      }

      apiClient.setAuthToken(token);
      const url = apiClient.getCampaignServiceUrl("campaigns");
      const response = await apiClient.post<ICampaign>(url, data);

      if (isAPISuccess(response)) return response.data;

      logger.error("Failed to create campaign:", response.message);
      return null;
    } catch (error) {
      logger.error("Error creating campaign:", error);
      return null;
    }
  }

  async updateCampaign(
    id: string,
    data: IUpdateCampaignData
  ): Promise<ICampaign | null> {
    try {
      const token = getAuthTokenClient();
      if (!token) {
        logger.error("No authentication token available");
        return null;
      }

      apiClient.setAuthToken(token);
      const url = apiClient.getCampaignServiceUrl(`campaigns/${id}`);
      const response = await apiClient.patch<ICampaign>(url, data);

      if (isAPISuccess(response)) return response.data;

      logger.error("Failed to update campaign:", response.message);
      return null;
    } catch (error) {
      logger.error("Error updating campaign:", error);
      return null;
    }
  }

  async uploadBannerToCdn(imageFile: File): Promise<string | null> {
    try {
      const token = getAuthTokenClient();
      if (!token) {
        logger.error("No authentication token available");
        return null;
      }

      const cdnUrl = apiClient.getCdnServiceUrl(
        "api/v1/images?folder=campaigns"
      );
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await apiClient.postFormData<{
        url: string;
        publicId: string;
      }>(cdnUrl, formData, { token });

      if (isAPISuccess(response)) return response.data.url;

      logger.error("Failed to upload banner to CDN:", response.message);
      return null;
    } catch (error) {
      logger.error("Error uploading banner to CDN:", error);
      return null;
    }
  }
}

export const campaignClientService = new CampaignClientService();
