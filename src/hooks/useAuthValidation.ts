"use client";

import { useEffect, useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUserClient } from "@/utils/auth.client";
import { logger } from "@/utils/logger";

interface UseAuthValidationOptions {
  protectedRoutes?: string[];

  validateOnMount?: boolean;

  validateOnRouteChange?: boolean;

  onInvalidToken?: () => void;
}

interface UseAuthValidationReturn {
  isValid: boolean;
  isValidating: boolean;
  validate: () => Promise<void>;
}

export function useAuthValidation(
  options: UseAuthValidationOptions = {}
): UseAuthValidationReturn {
  const {
    protectedRoutes = [
      "/perfil",
      "/criar-solicitacao",
      "/visualizar-solicitacao",
      "/hemocentros",
    ],
    validateOnMount = true,
    validateOnRouteChange = true,
    onInvalidToken,
  } = options;

  const pathname = usePathname();
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async () => {
    setIsValidating(true);

    try {
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname?.startsWith(route)
      );

      if (!isProtectedRoute) {
        setIsValid(true);
        setIsValidating(false);
        return;
      }

      // Server-side auth (middleware + ServerAuthWrapper) handles full token validation
      const user = await getCurrentUserClient();

      if (!user) {
        setIsValid(false);
        setIsValidating(false);

        if (onInvalidToken) {
          onInvalidToken();
        } else {
          const redirectUrl = `/login?redirect=${encodeURIComponent(
            pathname || "/"
          )}`;
          router.push(redirectUrl);
        }
        return;
      }

      setIsValid(true);
      setIsValidating(false);
    } catch (error) {
      logger.error("Error validating authentication:", error);
      setIsValid(false);
      setIsValidating(false);

      if (onInvalidToken) {
        onInvalidToken();
      } else {
        const redirectUrl = `/login?redirect=${encodeURIComponent(
          pathname || "/"
        )}`;
        router.push(redirectUrl);
      }
    }
  }, [pathname, protectedRoutes, router, onInvalidToken]);

  useEffect(() => {
    if (validateOnMount) {
      validate();
    }
  }, [validateOnMount, validate]);

  useEffect(() => {
    if (validateOnRouteChange) {
      validate();
    }
  }, [pathname, validateOnRouteChange, validate]);

  return {
    isValid: isValid ?? false,
    isValidating,
    validate,
  };
}
