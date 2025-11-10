import { IAuthUser } from "@/interfaces/User.interface";
import { APIService, isAPISuccess } from "@/service/api/api";
import { getAuthToken } from "@/utils/auth";

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

    console.error("Login failed:", response.message);
    return null;
  }

  async getUserById(userId: string): Promise<IAuthUser | null> {
    const token = await getAuthToken();

    if (!token) {
      return null;
    }

    const url = this.getUsersServiceUrl(`users/${userId}`);
    const response = await this.get<IAuthUser>(url, { token });

    if (isAPISuccess(response)) {
      return response.data;
    }

    return null;
  }
}
