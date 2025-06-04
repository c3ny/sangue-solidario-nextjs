import { Solicitation } from "@/interfaces/Solicitations.interface";
import axios, { AxiosResponse } from "axios";

class DonationsService {
  async getDonations(): Promise<Solicitation[]> {
    return (await axios.get("http://localhost:3333/donations")).data;
  }
}

const donationsService = new DonationsService();

export default donationsService;
