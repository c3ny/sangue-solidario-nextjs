"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Logout action - clears authentication cookies and redirects to home
 */
export async function logout() {
  const cookieStore = await cookies();

  // Clear authentication cookies
  cookieStore.delete("token");
  cookieStore.delete("user");

  // Redirect to home page
  redirect("/");
}
