"use server";

import { LoginService } from "@/features/Login/service/login.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signCookie } from "@/utils/cookie-signature";

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

    const cookieOptions = rememberMe
      ? {
          maxAge: 60 * 60 * 24 * 30,
          secure: true,
        }
      : {
          maxAge: 60 * 60 * 24,
          secure: true,
        };

    // Sign cookies before setting
    const signedToken = signCookie(result.token);
    const user = JSON.stringify(result.user);

    cookieStore.set("token", signedToken, cookieOptions);
    cookieStore.set("user", user, cookieOptions);

    const redirectPath = redirectTo?.toString() || "/";

    redirect(redirectPath);
  }

  return {
    message: "E-mail ou senha inválidos",
  };
}
