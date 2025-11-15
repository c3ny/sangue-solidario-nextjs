export interface JwtPayload {
  id: string;
  email: string;
  personType: string;
  iat?: number;
  exp?: number;
}

export function decodeJwtToken(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= payload.exp;
}

export function getTokenExpiration(token: string): number | null {
  const payload = decodeJwtToken(token);
  return payload?.exp || null;
}

export function getTimeUntilExpiration(token: string): number {
  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = payload.exp - currentTime;
  return Math.max(0, timeLeft);
}
