"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Client-side authentication wrapper component
 * This component checks if the user is authenticated and redirects to login if not
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

        // Check for authentication cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        const user = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="))
          ?.split("=")[1];

        const authenticated = !!(token && user);
        setIsAuthenticated(authenticated);

        if (!authenticated) {
          // Add current path as redirect parameter
          const currentPath = window.location.pathname;
          const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(
            currentPath
          )}`;
          router.push(redirectUrl);
        }
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
