import { IAuthUser } from "@/interfaces/User.interface";
import { APIService, isAPISuccess } from "@/service/api/api";

export interface ILoginResponse {
  token: string;
  user: IAuthUser;
}

export class LoginService extends APIService {
  /**
   * Authenticate user with email and password
   * @param email - User email
   * @param password - User password
   * @returns Login response with token and user data, or null on error
   */
  async login(email: string, password: string): Promise<ILoginResponse | null> {
    const url = this.getUsersServiceUrl("users/authenticate");
    console.log({
      email,
      password,
    });
    const response = await this.post<ILoginResponse>(url, {
      email,
      password,
    });

    if (isAPISuccess(response)) {
      return {
        token: response.data.token,
        user: response.data.user,
      };
    }

    console.error("Login failed:", response.message);
    return null;
  }

  /**
   * Get user data by ID
   * @param userId - The user ID
   * @returns User data or null on error
   */
  async getUserById(userId: string): Promise<IAuthUser | null> {
    const url = this.getUsersServiceUrl(`users/${userId}`);
    const response = await this.get<IAuthUser>(url);

    if (isAPISuccess(response)) {
      return response.data;
    }

    console.error("Failed to get user data:", response.message);
    return null;
  }
}
