"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { getCurrentUserClient } from "@/utils/auth.client";
import { logger } from "@/utils/logger";

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * Client-side authentication wrapper component
 * Checks if the user cookie exists (token is httpOnly, validated server-side by middleware)
 * Redirects to login if not authenticated
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
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const user = await getCurrentUserClient();
        if (cancelled) return;

        if (!user) {
          setIsAuthenticated(false);
          const currentPath = window.location.pathname;
          const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(
            currentPath
          )}`;
          router.push(redirectUrl);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        if (cancelled) return;
        logger.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        router.push(redirectTo);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router, redirectTo]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}
