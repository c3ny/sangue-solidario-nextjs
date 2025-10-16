import { APIService, isAPISuccess } from "@/service/api/api";
import {
  IRegistrationRequest,
  IRegistrationResponse,
} from "@/interfaces/Registration.interface";

/**
 * Registration Service
 * Handles user registration for both donors and companies
 */
class RegistrationService extends APIService {
  /**
   * Register a new user (donor or company)
   * @param data - Registration data
   * @returns Registration response or null on error
   */
  async register(
    data: IRegistrationRequest
  ): Promise<{ success: boolean; message: string }> {
    const url = this.getUsersServiceUrl("users");
    const response = await this.post<IRegistrationResponse>(url, data);

    if (isAPISuccess(response)) {
      return {
        success: true,
        message: "Cadastro realizado com sucesso",
      };
    }

    console.error("Registration failed:", response.message);
    return { success: false, message: response.message };
  }
}

const registrationService = new RegistrationService();

export default registrationService;
