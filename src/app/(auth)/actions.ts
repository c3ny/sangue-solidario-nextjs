"use server";

import { LoginService } from "@/features/Login/service/login.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  console.log({
    email,
    password,
  });
  const result = await new LoginService().login(
    email?.toString() ?? "",
    password?.toString() ?? ""
  );

  console.log(result);

  if (result) {
    const cookieStore = await cookies();
    cookieStore.set("token", result.token);
    cookieStore.set("user", JSON.stringify(result.user));

    redirect("/");
  }

  return { error: "Invalid email or password" };
}
