import { ApiService } from "@/service/api/api";
import { ContactForm } from "../interfaces/contact-form.interface";

class ContactAPIService extends ApiService {
  override path = "contact";

  async registerContact(data: ContactForm) {
    const response = await this.request("", {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(await response.json());
    return response;
  }
}

export default new ContactAPIService();
