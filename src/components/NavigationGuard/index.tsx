"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthValidation } from "@/hooks/useAuthValidation";

interface NavigationGuardProps {
  /**
   * Routes that require authentication
   */
  protectedRoutes?: string[];
  /**
   * Whether to show console logs for debugging
   */
  debug?: boolean;
}
export function NavigationGuard({
  protectedRoutes = ["/perfil", "/criar-solicitacao", "/hemocentros"],
  debug = false,
}: NavigationGuardProps) {
  const pathname = usePathname();

  const { isValid, isValidating } = useAuthValidation({
    protectedRoutes,
    validateOnMount: true,
    validateOnRouteChange: true,
  });

  useEffect(() => {
    if (debug) {
      console.log("NavigationGuard:", {
        pathname,
        isValid,
        isValidating,
        isProtected: protectedRoutes.some((route) =>
          pathname?.startsWith(route)
        ),
      });
    }
  }, [pathname, isValid, isValidating, protectedRoutes, debug]);

  return null;
}
