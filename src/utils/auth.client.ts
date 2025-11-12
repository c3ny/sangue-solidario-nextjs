import { IAuthUser } from "@/interfaces/User.interface";

function extractCookieValue(signedValue: string): string {
  if (!signedValue) {
    return signedValue;
  }

  const decoded = decodeURIComponent(signedValue);

  const separatorIndex = decoded.lastIndexOf(".");

  if (separatorIndex === -1) {
    return decoded;
  }

  return decoded.substring(0, separatorIndex);
}

export function getAuthTokenClient(): string | null {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return null;
    }

    return extractCookieValue(token);
  } catch (error) {
    console.error("Error getting auth token from client:", error);
    return null;
  }
}

export function getCurrentUserClient(): IAuthUser | null {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const user = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="))
      ?.split("=")[1];

    if (!user) {
      return null;
    }

    const valuePart = extractCookieValue(user);

    return JSON.parse(valuePart);
  } catch (error) {
    console.error("Error getting current user from client:", error);
    return null;
  }
}

export function isAuthenticatedClient(): boolean {
  const user = getCurrentUserClient();
  const token = getAuthTokenClient();
  return !!(user && token);
}
