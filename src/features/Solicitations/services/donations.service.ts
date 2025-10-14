import { APIService } from "@/service/api/api";
import { Solicitation } from "../interfaces/Solicitations.interface";

class DonationsService extends APIService {
  async getDonations(): Promise<Solicitation[]> {
    const url = this.getDonationServiceUrl("donations");

    return this.get(url) ?? [];
  }

  async getDonation(id: number): Promise<Solicitation> {
    const url = this.getDonationServiceUrl(`donations/${id}`);

    return this.get(url);
  }
}

const donationsService = new DonationsService();

export default donationsService;
