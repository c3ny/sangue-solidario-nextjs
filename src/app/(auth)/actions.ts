"use server";

import { LoginService } from "@/features/Login/service/login.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    password?.toString() ?? ""
  );

  console.log("result", result);
  if (result) {
    const cookieStore = await cookies();

    const cookieOptions = rememberMe
      ? { maxAge: 60 * 60 * 24 * 30 }
      : { maxAge: 60 * 60 * 24 };

    cookieStore.set("token", result.token, cookieOptions);
    cookieStore.set("user", JSON.stringify(result.user), cookieOptions);

    const redirectPath = redirectTo?.toString() || "/";

    redirect(redirectPath);
  }

  return {
    message: "E-mail ou senha inválidos",
  };
}
