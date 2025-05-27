import { Solicitation } from "@/interfaces/Solicitations.interface";
import axios, { AxiosResponse } from "axios";

class DonationsService {
  async getDonations(): Promise<AxiosResponse<Solicitation[]>> {
    return axios.get("http://localhost:3333/donations");
  }
}

const donationsService = new DonationsService();

export default donationsService;
