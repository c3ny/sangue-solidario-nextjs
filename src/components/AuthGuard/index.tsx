"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { getCurrentUserClient } from "@/utils/auth.client";
import { logger } from "@/utils/logger";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  protectedRoutes?: string[];
}

export function AuthGuard({
  children,
  fallback = <Loading />,
  protectedRoutes = [
    "/perfil",
    "/criar-solicitacao",
    "/visualizar-solicitacao",
    "/hemocentros",
  ],
}: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const validateAuth = async () => {
      try {
        const isProtectedRoute = protectedRoutes.some((route) =>
          pathname?.startsWith(route)
        );

        if (!isProtectedRoute) {
          if (cancelled) return;
          setIsAuthorized(true);
          setIsValidating(false);
          return;
        }

        const user = await getCurrentUserClient();
        if (cancelled) return;

        if (!user) {
          const redirectUrl = `/login?redirect=${encodeURIComponent(
            pathname || "/"
          )}`;
          router.push(redirectUrl);
          setIsAuthorized(false);
          setIsValidating(false);
          return;
        }

        setIsAuthorized(true);
        setIsValidating(false);
      } catch (error) {
        if (cancelled) return;
        logger.error("Error validating authentication:", error);
        setIsAuthorized(false);
        setIsValidating(false);

        const redirectUrl = `/login?redirect=${encodeURIComponent(
          pathname || "/"
        )}`;
        router.push(redirectUrl);
      }
    };

    validateAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, protectedRoutes]);

  if (isValidating) {
    return <>{fallback}</>;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return null;
}
