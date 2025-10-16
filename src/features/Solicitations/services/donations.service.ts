import { APIService, isAPISuccess } from "@/service/api/api";
import { Solicitation } from "../interfaces/Solicitations.interface";
import { PaginatedResult } from "@/types/pagination.types";

export interface GetDonationsParams {
  page?: number;
  limit?: number;
}

class DonationsService extends APIService {
  /**
   * Get paginated donations
   * @param params - Pagination parameters (page, limit)
   * @returns Paginated result with donations data or empty result on error
   */
  async getDonations(
    params: GetDonationsParams = {}
  ): Promise<PaginatedResult<Solicitation>> {
    const { page = 1, limit = 10 } = params;
    const url = this.getDonationServiceUrl(
      `donations?page=${page}&limit=${limit}`
    );

    const response = await this.get<PaginatedResult<Solicitation>>(url);

    if (isAPISuccess(response)) {
      return response.data;
    }

    // Return empty result on error
    console.error("Failed to fetch donations:", response.message);
    return {
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  /**
   * Get total count of donations
   * @returns Object with count property or { count: 0 } on error
   */
  async getDonationsCount(): Promise<{ count: number }> {
    const url = this.getDonationServiceUrl("donations/count");
    const response = await this.get<{ count: number }>(url);

    if (isAPISuccess(response)) {
      return response.data;
    }

    console.error("Failed to fetch donations count:", response.message);
    return { count: 0 };
  }

  /**
   * Get a single donation by ID
   * @param id - Donation ID
   * @returns Solicitation data or throws error
   */
  async getDonation(id: string): Promise<Solicitation | null> {
    const url = this.getDonationServiceUrl(`donations/${id}`);
    const response = await this.get<Solicitation>(url);

    if (isAPISuccess(response)) {
      return response.data;
    }

    console.error(`Failed to fetch donation ${id}:`, response.message);
    return null;
  }
}

const donationsService = new DonationsService();

export default donationsService;
