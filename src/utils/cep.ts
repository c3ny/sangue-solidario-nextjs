import { logger } from "@/utils/logger";

export interface ICepLookupResult {
  city: string;
  uf: string;
  address: string;
  neighborhood: string;
  zipcode: string;
}

/**
 * Looks up a Brazilian CEP via the local /api/cep route (backed by ViaCep).
 * Returns null if the CEP is invalid or not found.
 */
export async function lookupCep(cep: string): Promise<ICepLookupResult | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const res = await fetch(`/api/cep?cep=${digits}`);
    if (!res.ok) return null;
    return (await res.json()) as ICepLookupResult;
  } catch (err) {
    logger.error("CEP lookup failed:", err);
    return null;
  }
}
