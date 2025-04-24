import axios, { AxiosInstance } from "axios";

class DonationsService {
  getDonations() {
    return axios.get("http://localhost:3333/donations");
  }
}

const donationsService = new DonationsService();

export default donationsService;
