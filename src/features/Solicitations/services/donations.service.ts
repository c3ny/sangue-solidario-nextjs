import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import axios, { AxiosResponse } from "axios";

class DonationsService {
  async getDonations(): Promise<Solicitation[]> {
    return (await axios.get("http://localhost:3333/donations")).data;
  }

  async getDonation(id: number): Promise<Solicitation> {
    return (await axios.get(`http://localhost:3333/donations/${id}`)).data;
  }
}

const donationsService = new DonationsService();

export default donationsService;
