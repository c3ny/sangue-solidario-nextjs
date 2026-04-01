import { IAuthUser } from "@/interfaces/User.interface";
import { logger } from "@/utils/logger";

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

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (!cookie) return null;

    // usa indexOf para pegar tudo após o primeiro "=" preservando os "=" do JWT
    const token = cookie.substring(cookie.indexOf("=") + 1);

    return extractCookieValue(token);
  } catch (error) {
    logger.error("Error getting auth token from client:", error);
    return null;
  }
}

export function getCurrentUserClient(): IAuthUser | null {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));

    if (!cookie) return null;

    const user = cookie.substring(cookie.indexOf("=") + 1);

    return JSON.parse(decodeURIComponent(user));
  } catch (error) {
    logger.error("Error getting current user from client:", error);
    return null;
  }
}

export function isAuthenticatedClient(): boolean {
  const user = getCurrentUserClient();
  const token = getAuthTokenClient();
  return !!(user && token);
}
