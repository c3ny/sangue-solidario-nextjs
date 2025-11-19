"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { getAuthTokenClient } from "@/utils/auth.client";
import { isTokenExpired } from "@/utils/jwt";

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Client-side authentication wrapper component
 * This component checks if the user is authenticated and validates JWT token expiration
 * Redirects to login if not authenticated or token is expired
 * Use this for client components that need authentication
 */
export function AuthWrapper({
  children,
  fallback = <Loading />,
  redirectTo = "/login",
}: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if we're in the browser
        if (typeof window === "undefined") {
          return;
        }

        // Get token using the utility function (handles cookie extraction)
        const token = getAuthTokenClient();

        // Check for user cookie
        const user = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="))
          ?.split("=")[1];

        // If no token or user, not authenticated
        if (!token || !user) {
          setIsAuthenticated(false);
          const currentPath = window.location.pathname;
          const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(
            currentPath
          )}`;
          router.push(redirectUrl);
          setIsLoading(false);
          return;
        }

        // Validate JWT token expiration
        if (isTokenExpired(token)) {
          console.log("JWT token expired, redirecting to login");

          // Clear cookies
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie =
            "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          setIsAuthenticated(false);
          const currentPath = window.location.pathname;
          const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(
            currentPath
          )}&reason=session_expired`;
          router.push(redirectUrl);
          setIsLoading(false);
          return;
        }

        // Token is valid
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Show children only if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Return null while redirecting
  return null;
}
