import { APIService } from "@/service/api/api";
import { Solicitation } from "../interfaces/Solicitations.interface";
import { PaginatedResult } from "@/types/pagination.types";

export interface GetDonationsParams {
  page?: number;
  limit?: number;
}

class DonationsService extends APIService {
  async getDonations(
    params: GetDonationsParams = {}
  ): Promise<PaginatedResult<Solicitation>> {
    const { page = 1, limit = 10 } = params;
    const url = this.getDonationServiceUrl(
      `donations?page=${page}&limit=${limit}`
    );

    return this.get(url);
  }

  async getDonationsCount(): Promise<{ count: number }> {
    const url = this.getDonationServiceUrl("donations/count");
    return this.get(url);
  }

  async getDonation(id: number): Promise<Solicitation> {
    const url = this.getDonationServiceUrl(`donations/${id}`);

    return this.get(url);
  }
}

const donationsService = new DonationsService();

export default donationsService;
