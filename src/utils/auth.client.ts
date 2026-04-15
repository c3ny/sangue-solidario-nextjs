import { IAuthUser } from "@/interfaces/User.interface";
import { logger } from "@/utils/logger";

/**
 * Fetches the currently authenticated user from the server.
 *
 * Both `token` and `user` cookies are HTTPOnly, so client-side JS cannot read them.
 * The `/api/me` route validates the session server-side and returns the user payload
 * (or 401 if not authenticated).
 *
 * Use this from `"use client"` components and hooks. For server components, use
 * `getCurrentUser()` from `@/utils/auth` directly.
 *
 * For authenticated mutations, use Server Actions — never expose tokens to the
 * client.
 */
export async function getCurrentUserClient(): Promise<IAuthUser | null> {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const response = await fetch("/api/me", {
      credentials: "same-origin",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { user: IAuthUser | null };
    return data.user ?? null;
  } catch (error) {
    logger.error("Error fetching current user from /api/me:", error);
    return null;
  }
}
