import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IAuthUser } from "@/interfaces/User.interface";
import { unsignCookie } from "@/utils/cookie-signature";

/**
 * Get the current authenticated user from cookies
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(): Promise<IAuthUser | null> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie?.value) {
      return null;
    }

    const user = JSON.parse(userCookie.value);

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get the authentication token from cookies
 * @returns Token string or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");

    if (!tokenCookie?.value) {
      return null;
    }

    // Verify and unsign the cookie
    const unsignedValue = unsignCookie(tokenCookie.value);
    if (!unsignedValue) {
      console.error("Invalid cookie signature for token cookie");
      return null;
    }

    return unsignedValue;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  const token = await getAuthToken();
  return !!(user && token);
}

export function redirectToLogin(currentPath: string): never {
  const encodedPath = encodeURIComponent(currentPath);
  redirect(`/login?redirect=${encodedPath}`);
}

export async function requireAuth(currentPath: string): Promise<IAuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirectToLogin(currentPath);
  }
  return user;
}
