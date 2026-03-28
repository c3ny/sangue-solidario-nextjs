"use server";

import { LoginService } from "@/features/Login/service/login.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signCookie } from "@/utils/cookie-signature";
import { APIService, isAPIError } from "@/service/api/api";
import type { IAuthUser } from "@/interfaces/User.interface";

const SESSION_MAX_AGE = 60 * 60 * 24; // 24h

async function setSessionCookies(token: string, user: IAuthUser) {
  const cookieStore = await cookies();
  const opts = {
    maxAge: SESSION_MAX_AGE,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  };

  cookieStore.set("token", signCookie(token), { ...opts, httpOnly: true });
  cookieStore.set("user", JSON.stringify(user), opts);
}

export interface FormState {
  errors?: {
    [key: string]: string;
  };
  message?: string;
  success?: boolean;
}

export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirect");
  const rememberMe = formData.get("rememberMe") === "true";

  const result = await new LoginService().login(
    email?.toString() ?? "",
    password?.toString() ?? "",
    rememberMe
  );

  if (result) {
    const cookieStore = await cookies();

    const tokenCookieOptions = rememberMe
      ? {
          maxAge: 60 * 60 * 24 * 30,
          secure: true,
          httpOnly: true,
          sameSite: 'lax' as const,
          path: "/",
        }
      : {
          maxAge: 60 * 60 * 24,
          secure: true,
          httpOnly: true,
          sameSite: 'lax' as const,
          path: "/",
        };

    const userCookieOptions = rememberMe
      ? {
          maxAge: 60 * 60 * 24 * 30,
          secure: true,
          sameSite: 'lax' as const,
          path: "/",
        }
      : {
          maxAge: 60 * 60 * 24,
          secure: true,
          sameSite: 'lax' as const,
          path: "/",
        };

    // Sign cookies before setting
    const signedToken = signCookie(result.token);
    const user = JSON.stringify(result.user);

    cookieStore.set("token", signedToken, tokenCookieOptions);
    cookieStore.set("user", user, userCookieOptions);

    const redirectPath = redirectTo?.toString() || "/";

    redirect(redirectPath);
  }

  return {
    message: "E-mail ou senha inválidos",
  };
}

export async function loginOAuthGoogle(
  accessToken: string,
  redirectTo?: string
): Promise<string> {
  const apiService = new APIService();
  const url = apiService.getUsersServiceUrl("users/oauth/google");

  const result = await apiService.post<{ token: string; user: IAuthUser }>(
    url,
    { accessToken }
  );

  if (isAPIError(result)) {
    throw new Error("Google authentication failed");
  }

  await setSessionCookies(result.data.token, result.data.user);

  if (result.data.user.isProfileComplete === false) {
    return "/completar-cadastro";
  }

  return redirectTo || "/";
}

export async function loginOAuthApple(
  idToken: string,
  firstName?: string,
  lastName?: string,
  redirectTo?: string
): Promise<string> {
  const apiService = new APIService();
  const url = apiService.getUsersServiceUrl("users/oauth/apple");

  const result = await apiService.post<{ token: string; user: IAuthUser }>(
    url,
    { idToken, firstName, lastName }
  );

  if (isAPIError(result)) {
    throw new Error("Apple authentication failed");
  }

  await setSessionCookies(result.data.token, result.data.user);

  if (result.data.user.isProfileComplete === false) {
    return "/completar-cadastro";
  }

  return redirectTo || "/";
}
