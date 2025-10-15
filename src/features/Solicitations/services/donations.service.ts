import { APIService } from "@/service/api/api";
import { Solicitation } from "../interfaces/Solicitations.interface";
import { PaginatedResult } from "@/types/pagination.types";

class DonationsService extends APIService {
  async getDonations(): Promise<PaginatedResult<Solicitation>> {
    const url = this.getDonationServiceUrl("donations");

    return this.get(url);
  }

  async getDonation(id: number): Promise<Solicitation> {
    const url = this.getDonationServiceUrl(`donations/${id}`);

    return this.get(url);
  }
}

const donationsService = new DonationsService();

export default donationsService;
