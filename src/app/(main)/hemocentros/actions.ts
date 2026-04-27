"use server";

import { getAuthToken } from "@/utils/auth";
import { isTokenExpired } from "@/utils/jwt";
import { getMyCompany } from "@/features/Institution/services/company.service";
import { IInstitution } from "@/features/Institution/interfaces/Institution.interface";
import { logger } from "@/utils/logger";

/**
 * Fetches the authenticated company's full public profile (IInstitution).
 * Returns null if unauthenticated, token expired, or fetch fails.
 */
export async function getMyInstitutionAction(): Promise<IInstitution | null> {
  try {
    const token = await getAuthToken();
    if (!token || isTokenExpired(token)) return null;

    return await getMyCompany(token);
  } catch (error) {
    logger.error("getMyInstitutionAction error:", error);
    return null;
  }
}
