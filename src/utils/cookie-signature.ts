import { createHmac, timingSafeEqual } from "crypto";

/**
 * Cookie signature secret key
 * Should be set via environment variable COOKIE_SECRET
 * If not set, a default is used (not recommended for production)
 */
const COOKIE_SECRET =
  process.env.COOKIE_SECRET ||
  process.env.NEXT_PUBLIC_COOKIE_SECRET ||
  "default-secret-key-change-in-production";

/**
 * Algorithm used for signing cookies
 */
const ALGORITHM = "sha256";

/**
 * Separator between value and signature
 */
const SEPARATOR = ".";

/**
 * Sign a cookie value using HMAC-SHA256
 * @param value - The value to sign
 * @returns Signed cookie value in format: value.signature
 */
export function signCookie(value: string): string {
  if (!value) {
    throw new Error("Cannot sign empty value");
  }

  const signature = createHmac(ALGORITHM, COOKIE_SECRET)
    .update(value)
    .digest("base64url");

  return `${value}${SEPARATOR}${signature}`;
}

/**
 * Verify and unsign a cookie value
 * @param signedValue - The signed cookie value
 * @returns The original value if signature is valid, null otherwise
 */
export function unsignCookie(signedValue: string): string | null {
  if (!signedValue || !signedValue.includes(SEPARATOR)) {
    return null;
  }

  const lastIndex = signedValue.lastIndexOf(SEPARATOR);
  const value = signedValue.substring(0, lastIndex);
  const providedSignature = signedValue.substring(lastIndex + 1);

  // Recreate the signature
  const expectedSignature = createHmac(ALGORITHM, COOKIE_SECRET)
    .update(value)
    .digest("base64url");

  // Use timing-safe comparison to prevent timing attacks
  if (
    expectedSignature.length !== providedSignature.length ||
    !timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(providedSignature)
    )
  ) {
    return null;
  }

  return value;
}

/**
 * Verify if a cookie value is valid (has correct signature)
 * @param signedValue - The signed cookie value
 * @returns True if signature is valid, false otherwise
 */
export function verifyCookie(signedValue: string): boolean {
  return unsignCookie(signedValue) !== null;
}
