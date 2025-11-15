"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthTokenClient } from "@/utils/auth.client";
import { isTokenExpired } from "@/utils/jwt";
import Loading from "@/components/Loading";

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
    const validateAuth = () => {
      try {
        const isProtectedRoute = protectedRoutes.some((route) =>
          pathname?.startsWith(route)
        );

        if (!isProtectedRoute) {
          setIsAuthorized(true);
          setIsValidating(false);
          return;
        }

        const token = getAuthTokenClient();

        if (!token) {
          const redirectUrl = `/login?redirect=${encodeURIComponent(
            pathname || "/"
          )}`;
          router.push(redirectUrl);
          setIsAuthorized(false);
          setIsValidating(false);
          return;
        }

        if (isTokenExpired(token)) {
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie =
            "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          const redirectUrl = `/login?redirect=${encodeURIComponent(
            pathname || "/"
          )}&reason=session_expired`;
          router.push(redirectUrl);
          setIsAuthorized(false);
          setIsValidating(false);
          return;
        }

        setIsAuthorized(true);
        setIsValidating(false);
      } catch (error) {
        console.error("Error validating authentication:", error);
        setIsAuthorized(false);
        setIsValidating(false);

        const redirectUrl = `/login?redirect=${encodeURIComponent(
          pathname || "/"
        )}`;
        router.push(redirectUrl);
      }
    };

    validateAuth();
  }, [pathname, router, protectedRoutes]);

  if (isValidating) {
    return <>{fallback}</>;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return null;
}
