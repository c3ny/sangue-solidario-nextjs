import { IAuthUser } from "@/interfaces/User.interface";
import { APIService, isAPISuccess } from "@/service/api/api";
import { getAuthToken } from "@/utils/auth";
import { logger } from "@/utils/logger";

export interface ILoginResponse {
  token: string;
  user: IAuthUser;
}

export class LoginService extends APIService {
  async login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<ILoginResponse | null> {
    const url = this.getUsersServiceUrl("users/authenticate");
    const response = await this.post<ILoginResponse>(url, {
      email,
      password,
      rememberMe,
    });

    if (isAPISuccess(response)) {
      return {
        token: response.data.token,
        user: response.data.user,
      };
    }

    logger.error("Login failed:", response.message);
    return null;
  }

  async getUserById(userId: string): Promise<IAuthUser | null> {
    const token = await getAuthToken();

    if (!token) {
      return null;
    }

    const url = this.getUsersServiceUrl(`users/${userId}`);
    // cache: "no-store" — avatar/profile changes must reflect on next refresh.
    // Without this Next.js Data Cache may serve stale user data after action.
    const response = await this.get<IAuthUser>(url, {
      token,
      cache: "no-store",
    });

    if (isAPISuccess(response)) {
      return response.data;
    }

    return null;
  }

  /**
   * Retorna dados do donor para o usuario autenticado.
   * Null quando usuario nao e DONOR ou donor nao existe.
   */
  async getDonorProfile(userId: string): Promise<IDonorProfile | null> {
    const token = await getAuthToken();
    if (!token) return null;

    const url = this.getUsersServiceUrl(`users/${userId}/donor`);
    const response = await this.get<IDonorProfile>(url, { token });

    if (isAPISuccess(response)) {
      return response.data;
    }
    return null;
  }
}

export interface IDonorProfile {
  id: string;
  cpf: string;
  bloodType: string;
  birthDate: string | null;
  fkUserId: string;
  gender: "MALE" | "FEMALE" | null;
  lastDonationDate: string | null;
}
