/**
 * Edge Runtime compatible cookie signature utilities
 * Uses Web Crypto API instead of Node.js crypto module
 */

const SEPARATOR = ".";

function getCookieSecret(): string {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    throw new Error("COOKIE_SECRET environment variable is required");
  }
  return secret;
}

async function hmacSign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value)
  );
  // Convert to base64url
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function timingSafeCompare(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const aBuf = encoder.encode(a);
  const bBuf = encoder.encode(b);
  if (aBuf.length !== bBuf.length) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    crypto.getRandomValues(new Uint8Array(32)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const [sigA, sigB] = await Promise.all([
    crypto.subtle.sign("HMAC", key, aBuf),
    crypto.subtle.sign("HMAC", key, bBuf),
  ]);
  const viewA = new Uint8Array(sigA);
  const viewB = new Uint8Array(sigB);
  let result = 0;
  for (let i = 0; i < viewA.length; i++) {
    result |= viewA[i] ^ viewB[i];
  }
  return result === 0;
}

export async function unsignCookieEdge(
  signedValue: string
): Promise<string | null> {
  if (!signedValue || !signedValue.includes(SEPARATOR)) {
    return null;
  }

  const lastIndex = signedValue.lastIndexOf(SEPARATOR);
  const value = signedValue.substring(0, lastIndex);
  const providedSignature = signedValue.substring(lastIndex + 1);

  const expectedSignature = await hmacSign(value, getCookieSecret());

  const isValid = await timingSafeCompare(expectedSignature, providedSignature);
  if (!isValid) {
    return null;
  }

  return value;
}
