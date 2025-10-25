"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired, getTimeUntilExpiration } from "@/utils/jwt";

/**
 * Hook to monitor JWT token expiration and handle automatic logout
 * @param token - JWT token to monitor
 * @param onExpired - Callback when token expires
 * @param checkInterval - How often to check (in milliseconds, default: 30 seconds)
 */
export function useTokenExpiration(
  token: string | null,
  onExpired?: () => void,
  checkInterval: number = 30000
) {
  const router = useRouter();

  const handleTokenExpiration = useCallback(() => {
    if (!token) return;

    if (isTokenExpired(token)) {
      console.log("Token expired, redirecting to login");

      // Clear any stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Call custom handler if provided
      if (onExpired) {
        onExpired();
      } else {
        // Default: redirect to login
        router.push("/login?reason=session_expired");
      }
    }
  }, [token, onExpired, router]);

  useEffect(() => {
    if (!token) return;

    // Check immediately
    handleTokenExpiration();

    // Set up interval to check periodically
    const interval = setInterval(handleTokenExpiration, checkInterval);

    return () => clearInterval(interval);
  }, [token, handleTokenExpiration, checkInterval]);

  // Return utility functions
  return {
    isExpired: token ? isTokenExpired(token) : true,
    timeUntilExpiration: token ? getTimeUntilExpiration(token) : 0,
    checkExpiration: handleTokenExpiration,
  };
}
