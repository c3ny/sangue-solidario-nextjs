"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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

        // Check user cookie (not httpOnly) — server-side middleware handles full token validation
        const userCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("user="));

        if (!userCookie) {
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
