/**
 * Get the authentication token from cookies (client-side)
 * @returns Token string or null if not authenticated
 */
export function getAuthTokenClient(): string | null {
  try {
    // Check if we're in the browser
    if (typeof window === "undefined") {
      return null;
    }

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    return token || null;
  } catch (error) {
    console.error("Error getting auth token from client:", error);
    return null;
  }
}

/**
 * Get the current authenticated user from cookies (client-side)
 * @returns User object or null if not authenticated
 */
export function getCurrentUserClient(): any | null {
  try {
    // Check if we're in the browser
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

    return JSON.parse(decodeURIComponent(user));
  } catch (error) {
    console.error("Error getting current user from client:", error);
    return null;
  }
}

/**
 * Check if user is authenticated (client-side)
 * @returns boolean indicating authentication status
 */
export function isAuthenticatedClient(): boolean {
  const user = getCurrentUserClient();
  const token = getAuthTokenClient();
  return !!(user && token);
}
