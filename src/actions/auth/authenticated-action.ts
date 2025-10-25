"use server";

import { getCurrentUser, getAuthToken } from "@/utils/auth";
import { redirect } from "next/navigation";

/**
 * Wrapper for server actions that require authentication
 * Automatically handles authentication and provides user context
 */
export async function withAuth<T extends any[], R>(
  action: (user: any, token: string, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      // Get authenticated user
      const user = await getCurrentUser();
      if (!user) {
        redirect("/login");
      }

      // Get auth token
      const token = await getAuthToken();
      if (!token) {
        redirect("/login");
      }

      // Execute the action with user and token context
      return await action(user, token, ...args);
    } catch (error) {
      console.error("Authentication error in server action:", error);
      redirect("/login");
    }
  };
}

/**
 * Create an authenticated server action
 * Usage:
 *
 * export const createDonation = withAuth(async (user, token, data) => {
 *   // Your action logic here
 *   // user and token are automatically provided
 * });
 */
export { withAuth as createAuthenticatedAction };
